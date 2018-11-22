'use strict';

const Service = require('egg').Service;
const cheerio = require('cheerio');

class BrowserService extends Service {
  parsePage(html) {
    const $ = cheerio.load(html, {
      decodeEntities: false
    });

    const $browserItemList = $('#browserItemList > .item');
    let infoList = [];

    $browserItemList.each((index, el) => {
      const $el = $(el);
      const id = $el.attr('id').match(/\d+/)[0];

      const $rank = $el.find('.rank');
      let rank = 0;
      if ($rank.length) {
        rank = $rank.text().match(/\d+/)[0];
      }

      const $name = $el.find('.inner h3 a');
      const name = $name.text().trim();

      const $oName = $el.find('.inner h3 .grey');
      let oName = '';
      if ($oName.length) {
        oName = $oName.text().trim();
      }

      const $cover = $el.find('img.cover');
      const cover = $cover.attr('src');

      const info = $el.find('.info').text().trim().replace(/\n\s+/g, ' ');

      let rate = 0;
      let rateNum = 0;
      const $rateInfo = $el.find('.rateInfo');
      const $rate = $rateInfo.find('.fade');

      if ($rate.length) {
        rate = $rate.text();
        rateNum = $rateInfo.find('.tip_j').text().match(/\d+/)[0];
      }

      const toInt = this.ctx.helper.toInt;

      infoList.push({
        id: toInt(id),
        name,
        oName,
        cover,
        info,
        rank: toInt(rank),
        rate: Number(rate),
        rateNum: Number(rateNum) || 0
      });
    });

    return infoList;
  }
}

module.exports = BrowserService;