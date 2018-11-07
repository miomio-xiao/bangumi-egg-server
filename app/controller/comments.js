const Controller = require('egg').Controller;

class CommentController extends Controller {
  async list() {
    const ctx = this.ctx;

    const { page } = ctx.query;
    const { id } = ctx.params;
    
    const comments = await ctx.service.comments.list(id, page);
    ctx.body = comments;

    ctx.status = 200;
  }
}

module.exports = CommentController;
