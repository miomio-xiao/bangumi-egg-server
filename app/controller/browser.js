'use strict';

const Controller = require('egg').Controller;

class BrowserController extends Controller {
  async list() {
    const ctx = this.ctx;

    const {
      airtime,
      type
    } = ctx.params;
    const {
      page,
      sort
    } = ctx.query;

    const infoList = await ctx.service.browser.findList({
      airtime,
      type,
      page,
      sort
    });

    ctx.body = infoList;
    ctx.status = 200;
  }

  async listByTag() {
    const ctx = this.ctx;

    const {
      airtime,
      tag
    } = ctx.params;

    const {
      page,
      sort
    } = ctx.query;

    const infoList = await ctx.service.browser.findTagList({
      airtime,
      tag,
      page,
      sort
    });

    ctx.body = infoList;
    ctx.status = 200;
  }

  async collection() {
    const ctx = this.ctx;
    const {
      airtime = []
    } = ctx.queries;

    const {
      num
    } = ctx.query;

    const topList = await ctx.service.browser.findTopList(airtime, num);

    ctx.body = topList;
    ctx.status = 200;
  }
}

module.exports = BrowserController;