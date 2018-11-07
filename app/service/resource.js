'use strict';

const Service = require('egg').Service;
const bangumiData = require('bangumi-data');

class ResourceService extends Service {
  list(id) {
    const bangumiItems = bangumiData.items;
    const siteMeta = bangumiData.siteMeta;

    const bangumiInfo = bangumiItems
      .find(bangumi => (bangumi.sites || []).find(site =>
        site.site === 'bangumi' && site.id === id));

    if (!bangumiInfo) {
      return [];
    }

    const sites = bangumiInfo.sites;

    return sites.map(site => {
      const siteKey = site.site;
      const meta = siteMeta[siteKey];
      return {
        key: siteKey,
        title: meta.title,
        type: meta.type,
        url: meta.urlTemplate.replace('{{id}}', site.id),
        siteInfo: site
      };
    });
  }
}

module.exports = ResourceService;