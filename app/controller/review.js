'use strict';

const Controller = require('egg').Controller;

class ReviewController extends Controller {
  async list() {
    const ctx = this.ctx;
    console.log(ctx.query);

    ctx.body = await ctx.service.review.list(ctx.query);
  }
}

module.exports = ReviewController;