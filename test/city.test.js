'use strict';

// const request = require('supertest');
const mm = require('egg-mock');

describe('test/city.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'apps/city-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mm.restore);

  it('should GET /', async () => {
    const ctx = app.mockContext();
    const user = await ctx.service.city.getCity('fengmk1');
    console.log(user);
  });

  after(() => app.close());
});

