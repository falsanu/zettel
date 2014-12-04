'use strict';

var _ = require('underscore');

exports.handlebars = null;

exports.dump = {
  helper: function (context) {
    return new exports.handlebars.SafeString('<pre class="debug">' + JSON.stringify(context) + '</pre>');
  }
};