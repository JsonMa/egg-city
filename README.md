# egg-city

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-city.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-city
[travis-image]: https://www.travis-ci.org/JsonMa/egg-city.svg?branch=master
[travis-url]: https://www.travis-ci.org/JsonMa/egg-city
[codecov-image]: https://codecov.io/gh/JsonMa/egg-city/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/JsonMa/egg-city
[david-image]: https://img.shields.io/david/JsonMa/egg-city.svg?style=flat-square
[david-url]: https://david-dm.org/JsonMa/egg-city
[snyk-image]: https://snyk.io/test/npm/egg-city/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-city
[download-image]: https://img.shields.io/npm/dm/egg-city.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-city

<!--
Description here.
-->

## Install

```bash
$ npm i egg-city --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.city = {
  enable: true,
  package: 'egg-city',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.city = {
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

```js

// {app_root}/app/controller/home.js
'use strict';

class HomeController extends app.Controller {
  async index() {

    /**
    * 获取城市信息
    * @method getCity
    * @param {string} queryInfo - 根据名称或代号进行查询，名称为中文，代号为6位数字组成的字符串
    * @returns {array} 数组成员为object类型，object中包含了相应的省、市、区所有信息
	* @description 返回值成员的属性包括：
	* @description name（城市名称）
	* @description code（城市代号）
	* @description distinctInfo（拥有的所有“区/县”信息，若查询本身为“县/区”级别，则不含该字段）
	* @description provinceInfo（所属“省份”信息，若查询本身为“省”级别，则不含该字段）
	* @description cityInfo（包含/所属“市”信息，若查询本身为“市”级别，则不含该字段）
    */
    const cityInfo = await this.service.city.getCity('四川');
  }
}
module.exports = HomeController;
```

## Questions & Suggestions

Please open an issue [here](https://github.com/JsonMa/egg-city/issues).

## License

[MIT](LICENSE)
