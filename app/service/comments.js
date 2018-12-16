const Service = require('egg').Service;
const cheerio = require('cheerio');

class CommentService extends Service {
  async list(id, page = 1) {
    if (!id) {
      return [];
    }

    const {
      baseUrl
    } = this.config.bangumi;

    const {
      data: html
    } = await this.ctx.curl(
      `${baseUrl}/subject/${id}/comments?page=${page}`, {
        timeout: ['20s', '20s']
      }
    );

    const comments = this.parse(html.toString());

    return comments;
  }

  parse(html) {
    const $ = cheerio.load(html);

    const $comments = $('#comment_box > .item');

    const comments = [];

    $comments.map((index, el) => {
      const $el = $(el);

      const $avatar = $el.find('.avatarNeue');
      const style = $avatar.attr('style');
      const avatar = style.match(/url\(["'](.*)["']\)/)[1];

      const $text = $el.find('.text');

      const $user = $text.find('a');
      const name = $user.text();
      const href = $user.attr('href');

      const age = $text
        .find('small')
        .text()
        .replace(/\s+/g, ' ');

      const content = $text.find('p').text();

      let starNum = 0;

      const star = $text.find('.starsinfo').attr('class');

      if (star) {
        const matchResult = star.match(/sstars(\d+)/);

        starNum = matchResult ? matchResult[1] : 0;
      }

      comments.push({
        user: {
          href,
          avatar,
          name
        },
        age,
        content,
        starNum,
      });
    });

    return comments;
  }
}

module.exports = CommentService;