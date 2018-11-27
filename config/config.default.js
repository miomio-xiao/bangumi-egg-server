'use strict';

module.exports = appInfo => {
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1541319966583_8610';

  // add your config here
  config.middleware = ['proxy', 'errorHandler'];

  config.proxy = {
    targets: {
      '/api/bgm/(.*)': {
        target: 'https://api.bgm.tv',
        changeOrigin: true,
        pathRewrite: {
          '/api/bgm': '',
        },
      }
    },
  };

  config.bangumi = {
    baseUrl: 'http://bgm.tv',
  };

  return config;
};