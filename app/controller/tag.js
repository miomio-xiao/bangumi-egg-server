'use strict';

const Controller = require('egg').Controller;

class TagController extends Controller {
  async list() {
    const ctx = this.ctx;

    const { page, type } = ctx.query;

    let tagList = [];

    if (type === 'all') {
      tagList = await ctx.service.tag.list(page);
    } else {
      tagList = await ctx.service.tag.fetchPage(page);
    }

    ctx.body = tagList;
    ctx.status = 200;
  }

  async listBySubject() {
    const ctx = this.ctx;

    const { id } = ctx.params;

    const tagList = await ctx.service.tag.listBySubjectId(id);

    ctx.body = tagList;
    ctx.status = 200;
  }
}

module.exports = TagController;
