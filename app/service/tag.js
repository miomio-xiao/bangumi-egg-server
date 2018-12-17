'use strict';

const Service = require('egg').Service;
const cheerio = require('cheerio');

class TagService extends Service {
  constructor(ctx) {
    super(ctx);

    this.baseUrl = this.config.bangumi.baseUrl;
  }

  async list(totalPage = 1) {
    const tagList = [];

    for (let page = 1; page <= totalPage; page++) {
      const tags = await this.fetchPage(page);

      tagList.push(...tags);
    }

    return tagList;
  }

  async fetchPage(page = 1) {
    const {
      data
    } = await this.ctx.curl(`${this.baseUrl}/anime/tag?page=${page}`, {
      timeout: ['20s', '20s']
    });

    const html = data.toString();

    const tagList = this.parsePage(html);

    return tagList;
  }

  parsePage(html) {
    const $ = cheerio.load(html, {
      decodeEntities: false
    });

    const $tagList = $('#tagList').find('a');

    let tagList = [];

    $tagList.each((index, el) => {
      const $el = $(el);
      const text = $el.text().trim();

      const $num = $el.next('.grey');
      let num = 0;
      if ($num.length) {
        num = parseInt($num.text().match(/\d+/)[0]);
      }

      tagList.push({
        text,
        num
      });
    });

    return tagList;
  }
}

module.exports = TagService;