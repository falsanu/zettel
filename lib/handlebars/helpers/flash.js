'use strict';

var _ = require('underscore');

exports.flash = {
  helper: function (value, options) {

    var output = '';

    if (_.isFunction(value.getMessages)) {
      var messages = _.clone(value.getMessages());
      value.clearMessages();
      for (var i = 0, u = messages.length; i < u; i++) {
        var message = messages[i];
        output += options.fn(message);
      }
    }

    return output;

  }
};