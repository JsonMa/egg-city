'use strict';

module.exports = (app) => {
  app.get('/', async () => {
    this.body = `hi, ${app.plugins.city.name}`;
  });
};
