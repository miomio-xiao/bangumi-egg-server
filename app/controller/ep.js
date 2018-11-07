'use strict';

const Controller = require('egg').Controller;

class EpController extends Controller {
  async list() {
    const ctx = this.ctx;
    const id = ctx.params.id;

    const epList = await ctx.service.ep.list(id);
    
    ctx.body = epList;
    ctx.status = 200;
  }
}

module.exports = EpController;