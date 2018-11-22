'use strict';

const Service = require('egg').Service;

class RankService extends Service {
  constructor(ctx) {
    super(ctx);

    this.baseUrl = this.config.bangumi.baseUrl
    this.pageSize = 24;
  }

  async fetchTopRank(num = 100) {
    const rankList = [];
    let page = 1;
    let time = 0;

    while (true) {
      this.logger.info(`fetch page: ${page}`);

      let html = '';

      try {
        const {
          data,
          status
        } = await this.ctx.curl(`${this.baseUrl}/anime/browser/?sort=rank&page=${page}`, {
          timeout: ['20s', '20s']
        });

        if (status !== 200) {
          throw new Error(status);
        }

        html = data.toString();
      } catch (error) {
        this.logger.error(`fetch page: ${page} error`, error);
        if (++time > 3) {
          break;
        }
        continue;
      }

      time = 0;

      this.logger.info(`fetch page: ${page} success`);

      page++;
      const rankInfo = this.ctx.service.browser.parsePage(html);

      rankList.push(...rankInfo);

      if (rankList.length > num) {
        rankList.slice(0, num);
        break;
      }

      if (page > num / this.pageSize) {
        break;
      }
    }

    return rankList;
  }
}

module.exports = RankService;