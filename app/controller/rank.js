'use strict';

const Controller = require('egg').Controller;

class RankController extends Controller {
  async top() {
    const ctx = this.ctx;
    const num = ctx.params.num;

    const rankList = await ctx.service.rank.fetchTopRank(num);

    ctx.body = rankList;
    ctx.status = 200;
  }
}

module.exports = RankController;