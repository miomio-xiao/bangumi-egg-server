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

  async list(id, page = 1) {
    const {
      data
    } = await this.ctx.curl(`${this.baseUrl}/subject/${id}/reviews/${page}.html`, {
      timeout: ['20s', '20s']
    });

    const html = data.toString();

    return this.parseBlogList(html);
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

  parseBlogList(html) {
    const $ = cheerio.load(html, {
      decodeEntities: false
    });

    const blogList = [];
      
    const $blogs = $('#entry_list > .item');
    $blogs.each((index, el) => {
      const $el = $(el);

      const $title = $el.find('.title a');
      const title = $title.text();
      const url = $title.attr('href');
      const id = url.match(/\d+/)[0];

      const repliesMatch = $el.find('.orange').text().match(/\(\+(\d+)\)/);
      const replies = repliesMatch ? repliesMatch[1] : 0;

      const dateline = $el.find('small.time').text();
      const summary = $el.find('.content').text().replace(/\(more\)$/, '');

      const avatar = $el.find('.image img').attr('src');
      const $user = $el.find('.tip_j a');
      const nickname = $user.text();
      const userUrl = $user.attr('href');

      console.log(userUrl);
      const username = userUrl.match(/user\/(.+)/)[1];

      const user = {
        url: userUrl,
        username,
        nickname,
        avatar
      }

      blogList.push({
        id,
        title,
        user,
        replies,
        dateline,
        summary
      });
    })

    return blogList;
  }
}

module.exports = BlogService;