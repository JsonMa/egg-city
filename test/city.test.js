'use strict';

// const request = require('supertest');
const mm = require('egg-mock');
const assert = require('assert');

describe('test api through input type', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'apps/city-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mm.restore);

  it('should return city info through code', async () => {
    const ctx = app.mockContext();
    const cityInfo = await ctx.service.City.getCity('360000');
    assert(cityInfo[0].code === '360000');
  });

  it('should return city info through name', async () => {
    const ctx = app.mockContext();
    const cityInfo = await ctx.service.City.getCity('宿迁市');
    assert(cityInfo[0].name === '宿迁市');
  });

  describe('test api through city type', () => {
    it('should return province info', async () => {
      const ctx = app.mockContext();
      const province = await ctx.service.City.getCity('320000');
      assert(province[0].code === '320000');
    });

    it('should return city info', async () => {
      const ctx = app.mockContext();
      const city = await ctx.service.City.getCity('139000');
      assert(city[0].code === '139000');
    });

    it('should return distinct info', async () => {
      const ctx = app.mockContext();
      const distinct = await ctx.service.City.getCity('410922');
      assert(distinct[0].code === '410922');
    });
  });
});

