const { VError } = require('verror');
const assert = require('assert');
const readLine = require('lei-stream').readLine;
const path = require('path');
const _ = require('underscore');

const DATA_CONTAINER = {};
const cityError = (msg, err) => {
  assert(msg, '缺少错误信息');
  return new VError({
    name: 'CITYERROR',
    cause: err,
  }, msg);
};
module.exports = app => class city extends app.Service {

  /**
   * 获取城市信息
   * @method getCityInfo
   * @param {string} queryInfo - 根据名称或代号进行查询，名称为中文，代号为6位数字组成的字符串
   * @returns {object} 返回值包含了相应的省、市、区所有信息
   */
  async getCityInfo(queryInfo) {
    assert(queryInfo && typeof queryInfo === 'string', cityError('查询信息必填且类型需为字符串'));
    const isCode = /^\d{6}$/.test(parseInt(queryInfo, 10));
    const isName = /^[\u4e00-\u9fa5]{1,10}$/.test(queryInfo);
    const queryResult = [];
    let deepQueryResult = [];
    const CITY_THIS = this;

    /** 若没有进行初始化，则初始化 */
    if (_.isEmpty(DATA_CONTAINER)) await this.init();

    /** 判断查询的类型，0代表按名称查找，1代表按代号查找 */
    if (isName) {
      /** 普通查找，采用字符串匹配 */
      _.keys(DATA_CONTAINER).forEach((key) => {
        for (let i = 0; i < DATA_CONTAINER[key].length; i++) {
          const query = JSON.parse(DATA_CONTAINER[key][i]);
          if (query.name.indexOf(queryInfo) !== -1) {
            queryResult.push(query);
          }
        }
      });
    } else if (isCode) {
      /** 代号查找，则采用二分搜索算法 */
      _.keys(DATA_CONTAINER).forEach((key) => {
        const query = CITY_THIS.binarySearch(parseInt(queryInfo, 10), DATA_CONTAINER[key]);
        if (query !== -1) {
          queryResult.push(JSON.parse(query));
        }
      });
    } else {
      throw cityError('查询参数类型错误');
    }

    /** 深入迭代，找出对应的省、市、区所有信息 */
    deepQueryResult = queryResult.map((queryItem) => {
      const query = queryItem;
      if (query.parent_code && query._id) {
        /** 若为区，则返回省、市的信息 */
        const parentCode = parseInt(query.parent_code, 10);
        const parentResult = JSON.parse(CITY_THIS.binarySearch(parentCode, DATA_CONTAINER.cities));
        if (queryResult !== -1) {
          query.cityInfo = parentResult;
          DATA_CONTAINER.provinces.forEach((province) => {
            const parsedProvince = JSON.parse(province);
            if (parsedProvince.code === parentResult.parent_code) {
              query.provinceInfo = parsedProvince;
            }
          });
        }
      } else if (query.parent_code) {
        /** 若为市，则返回省、区的信息 */
        const parentCode = parseInt(query.parent_code, 10);
        const parentResult = CITY_THIS.binarySearch(parentCode, DATA_CONTAINER.provinces);
        if (queryResult !== -1) query.provinceInfo = parentResult;
        query.distinctInfo = [];
        DATA_CONTAINER.distincts.forEach((distinct) => {
          const parsedDistinct = JSON.parse(distinct);
          if (parsedDistinct.parent_code === query.code) {
            query.distinctInfo.push(parsedDistinct);
          }
        });
      } else {
        /** 若为省，则返回所有市、区的信息 */
        query.cityInfo = [];
        query.distinctInfo = [];
        DATA_CONTAINER.cities.forEach((cityItem) => {
          const parsedCityItem = JSON.parse(cityItem);
          if (parsedCityItem.parent_code === query.code) {
            /** 获取匹配到的市 */
            query.cityInfo.push(parsedCityItem);
            parsedCityItem.distinctInfo = [];
            DATA_CONTAINER.distincts.forEach((distinct) => {
              const parsedDistinct = JSON.parse(distinct);
              if (parsedDistinct.parent_code === parsedCityItem.code) {
                parsedCityItem.distinctInfo.push(parsedDistinct);
                query.distinctInfo.push(parsedDistinct);
              }
            });
          }
        });
      }
      return query;
    });
    return deepQueryResult;
  }

  binarySearch(target, array) {
    assert.equal(typeof target, 'number', cityError('二分查找传入的target目标值需为数字'));
    let low = 0;
    let high = array.length - 1;
    let mid;
    let midItem;
    while (low <= high) {
      mid = Math.floor((low + high) / 2);
      midItem = parseInt(JSON.parse(array[mid]).code, 10);
      if (target < midItem) {
        high = mid - 1;
      } else if (target > midItem) {
        low = mid + 1;
      } else {
        return array[mid];
      }
    }
    return -1;
  }

  readFile(fileName) {
    return new Promise((resolve) => {
      assert(fileName);
      const filePath = path.resolve(__dirname, `../public/${fileName}`);
      const emptyArray = [];

      /** 按行读取数据 */
      readLine(filePath).go((data, next) => {
        emptyArray.push(data);
        next();
      }, () => {
        app.logger.info('end');
        resolve(emptyArray);
      });
    }).catch((err) => {
      /** 错误处理 */
      throw cityError('readLine出错', err);
    });
  }

  async init() {
    const CITY_THIS = this;
    const promises = [];
    const jsonFiles = ['provinces', 'cities', 'distincts'];

    /** 异步调用 */
    jsonFiles.forEach((jsonFile) => {
      promises.push(CITY_THIS.readFile(`${jsonFile}.json`));
    });
    const results = await Promise.all(promises);

    /** 排序 */
    results.sort((a, b) => {
      if (a.length > b.length) return 1;
      else if (a.length < b.length) return -1;
      return 0;
    });

    /** 属性赋值 */
    jsonFiles.forEach((fileName, index) => {
      DATA_CONTAINER[fileName] = results[index];
    });
  }
};
