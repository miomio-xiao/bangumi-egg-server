'use strict';

const Controller = require('egg').Controller;

class BlogController extends Controller {
  async content() {
    const ctx = this.ctx;
    const id = ctx.params.id;

    const content = await ctx.service.blog.content(id);

    ctx.body = content;
    ctx.status = 200;
  }
}

module.exports = BlogController;