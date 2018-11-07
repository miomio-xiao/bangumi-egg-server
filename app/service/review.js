'use strict';

const Service = require('egg').Service;

class ReviewService extends Service {
  constructor(ctx) {
    super(ctx);
    this.root = 'https://windrises.net';
  }

  async request(url, opts) {
    url = `${this.root}${url}`;
    opts = Object.assign({
      timeout: ['20s', '20s'],
      dataType: 'json',
    }, opts);
    return this.ctx.curl(url, opts);
  }

  checkSuccess(result) {
    if (result.status !== 200) {
      const errorMsg = result.data && result.data.error_msg ? result.data.error_msg : 'unknown error';
      this.ctx.throw(result.status, errorMsg);
    }
  }

  async list(params) {
    const result = await this.request('/bgmtools/review/api', {
      data: params
    });

    this.checkSuccess(result);
    return result.data;
  }
}

module.exports = ReviewService;