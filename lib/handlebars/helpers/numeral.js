'use strict';

var numeral = require('numeral');

exports.format = {
  // TODO: possibly add languages as a parameter, for localization
  helper: function (value, format) {
    return numeral(value).format(format);
  }
};