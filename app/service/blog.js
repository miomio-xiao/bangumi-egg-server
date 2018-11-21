const Service = require('egg').Service;
const cheerio = require('cheerio');

class BlogService extends Service {
  constructor(ctx) {
    super(ctx);

    this.baseUrl = this.config.bangumi.baseUrl;
  }

  async content(id) {
    if (!id) {
      return {
        blog: {},
        comments: []
      };
    }

    const {
      data
    } = await this.ctx.curl(`${this.baseUrl}/blog/${id}`, {
      timeout: ['20s', '20s']
    });

    const html = data.toString();

    const blog = this.parseBlog(html);
    const comments = this.ctx.service.ep.parse(html);

    return {
      blog,
      comments
    };
  }

  parseBlog(html) {
    const $ = cheerio.load(html, {
      decodeEntities: false
    });

    const $pageHeader = $('#pageHeader');
    const userInfo = this.parsePageHeader($pageHeader);

    const $time = $('#columnA > .re_info');
    const time = $time
      .text()
      .split('/')[0]
      .trim();

    const $view = $('#viewEntry');
    const $tags = $view.find('.tags a');
    let tag = [];
    $tags.each(function () {
      const $el = $(this);
      tag.push({
        href: $el.attr('href'),
        text: $el.text()
      });
    });

    const $content = $view.find('#entry_content');
    const content = $content.html();

    return {
      ...userInfo,
      time,
      content,
      tag
    };
  }

  parsePageHeader($el) {
    const $user = $el.find('a.avatar');
    const name = $user.text().trim();
    const href = $user.attr('href');

    const $avatar = $el.find('img.avatar');
    const avatar = $avatar.attr('src');

    const $title = $el
      .find('h1')
      .contents()
      .last();

    return {
      user: {
        href,
        name,
        avatar
      },
      title: $title.text().trim()
    };
  }
}

module.exports = BlogService;