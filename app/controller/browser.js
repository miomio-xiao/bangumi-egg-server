'use strict';

const Controller = require('egg').Controller;

class BrowserController extends Controller {
  async list() {
    const ctx = this.ctx;

    const { airtime, type } = ctx.params;
    const { page, sort } = ctx.query;

    const infoList = await ctx.service.browser.findList({
      airtime,
      type,
      page,
      sort
    });

    ctx.body = infoList;
    ctx.status = 200;
  }
}

module.exports = BrowserController;
