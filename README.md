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
[david-image]: https://img.shields.io/david/eggjs/egg-city.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-city
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

// {app_root}/app/controller/city.js
const Controller = require('egg').Controller;
class cityDemo extends Controller {
  async apiDemo() {

    /**
    * 获取城市信息
    * @method getCity
    * @param {string} queryInfo - 根据名称或代号进行查询，名称为中文，代号为6位数字组成的字符串
    * @returns {object} 返回值包含了相应的省、市、区所有信息
    */
    const cityInfo = await ctx.service.city.getCity('360000');
  }
}
module.exports = PostController;
```

## Questions & Suggestions

Please open an issue [here](https://github.com/JsonMa/egg-city/issues).

## License

[MIT](LICENSE)
