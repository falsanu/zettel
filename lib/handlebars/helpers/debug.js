'use strict';

exports.dump = {
  helper: function (context) {
    return '<pre class="debug">' + JSON.stringify(context, null, 2) + '</pre>';
  }
};