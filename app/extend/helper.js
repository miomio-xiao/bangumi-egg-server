'use strict';

const _ = require('lodash');

module.exports = {
  toInt(string) {
    if (typeof string === 'number') return string;
    if (!string) return string;
    return parseInt(string) || 0;
  }
};