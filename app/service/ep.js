const Service = require('egg').Service;
const cheerio = require('cheerio');

class EpService extends Service {
  constructor(ctx) {
    super(ctx);

    this.baseUrl = this.config.bangumi.baseUrl;
  }

  async list(id) {
    if (!id) {
      return [];
    }

    const {
      data: html
    } = await this.ctx.curl(
      `${this.baseUrl}/ep/${id}`
    );

    const floorList = this.parse(html.toString());

    return floorList;
  }

  parse(html) {
    const $ = cheerio.load(html, {
      decodeEntities: false
    });

    const $list = $('#comment_list');
    const $floorList = $list.find(`[name^='floor']`);

    const floorList = [];

    $floorList.each((index, el) => {
      const $el = $(el);

      const floorAttr = $el.attr('name');

      if (!floorAttr) {
        return;
      }

      const matchResult = floorAttr.match(/floor-(\d+)(-(\d+))?/)

      if (!matchResult) {
        return;
      }

      const floorIndex = matchResult[1];
      const subIndex = matchResult[3];

      const result = this.parseFloor($el, subIndex);
      if (subIndex) {
        let sub = floorList[floorIndex - 1].sub;
        sub[subIndex - 1] = {
          floor: subIndex,
          ...result
        }
      } else {
        floorList[floorIndex - 1] = {
          ...result,
          floor: floorIndex,
          sub: []
        }
      }
    });

    return floorList;
  }

  parseFloor($el, isSub) {
    const id = $el.attr('id').substring(5);
    const reInfo = $el.children('.re_info').text();
    const time = reInfo.match(/\s+-\s+(.*)/)[1];

    const $inner = $el.children('.inner');
    const $user = $inner.children('strong');
    const name = $user.text();
    const href = $user.children('a').attr('href');

    const $avatar = $el.children('.avatar').find('.avatarNeue');
    const style = $avatar.attr('style');
    const avatar = style.match(/url\(["'](.*)["']\)/)[1];

    const $content = isSub ? $inner.find('.cmt_sub_content') : $inner.find('.message');

    let content = $content.html().trim();

    content = content.replace(/(\/img\/.*?gif)/g, match => `${this.baseUrl}${match}`);

    return {
      id,
      user: {
        avatar,
        name,
        href,
      },
      time,
      content
    };
  }
}

module.exports = EpService;