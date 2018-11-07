'use strict';

const Controller = require('egg').Controller;

class ResourceController extends Controller {
  list() {
    const ctx = this.ctx;

    const id = ctx.params.id;

    ctx.body = ctx.service.resource.list(id);
  }
}

module.exports = ResourceController;