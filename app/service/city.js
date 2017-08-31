const { VError } = require('verror');
const assert = require('assert');

function cityError(msg, err) {
  assert(msg, '缺少错误信息');
  return new VError({
    name: 'CITYERROR',
    cause: err,
  }, msg);
}

module.exports = (app) => {
  return class city extends app.Service {
    getCity(name) {
      return name;
    }
  };
};
