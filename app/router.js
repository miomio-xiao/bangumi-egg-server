'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/api/subject/:id/comments', controller.comments.list);
  router.get('/api/subject/:id/resource', controller.resource.list);
  router.get('/api/ep/:id', controller.ep.list);
  router.get('/api/blog/:id', controller.blog.content);

  router.get('/api/rank/:num', controller.rank.top);

  router.get('/api/browser', controller.browser.list);
  router.get('/api/browser/:type', controller.browser.list);
  router.get('/api/browser/:type/:airtime', controller.browser.list);

  // 第三方api
  router.get('/api/review', controller.review.list);
};
