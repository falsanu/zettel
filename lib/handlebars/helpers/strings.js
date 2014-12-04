'use strict';

var _ = require('underscore');
var dotty = require('dotty');
var vprintf = require('sprintf').vsprintf;

var map = {
  '0': 'zero',
  '1': 'one',
  '2': 'two',
  '3': 'three',
  '4': 'four',
  '5': 'five',
  '6': 'six',
  '7': 'seven',
  '8': 'eight',
  '9': 'nine'
};

/**
 * Join is a view helper which glues elements of an array or an (nested) object
 * with a string.
 *
 * @param values {Array}
 * @param glue {String}
 * @param options {String}
 */
exports.join = {

  helper: function (values, glue, options) {

    if (!_.isString(glue)) {
      glue = '';
    }

    if (_.isArray(values) && options) {
      return _.map(values,function (item) {
        return dotty.get(item, options);
      }).join(glue);
    }

    if (_.isArray(values)) {
      return values.join(glue);
    }

    return '';
  }

};

exports.sprintf = {
  helper: function (format /*args */) {
    if (arguments.length === 0) {
      return '';
    } else if (arguments.length === 1) {
      return format;
    } else if (arguments.length > 1) {
      var args = Array.prototype.slice.call(arguments).slice(1);
      args.pop();
      var text = vprintf(format, args);
      return text;
    }
  }
};

exports.figure = {
  helper: function (number) {
    var numberToUse = number.toString();

    var result = [];

    for (var i = 0, u = numberToUse.length; i < u; i++) {
      var figure = numberToUse[i];
      if (map[figure]) {
        result.push(map[figure]);
      }
    }

    if (result.length > 0 && parseInt(number) < 0) {
      result = ['minus'].concat(result);
    }

    return result.join(' ');

  }
};

exports.splitString = {
  helper: function (context, options) {
    if (context) {
      var ret = '';
      var index = null;
      var tempArr = context.trim().split(options.hash.delimiter);

      if (_.isNumber(options.hash.index)) {
        index = options.hash.index;
      }
      for (var i = 0; i < tempArr.length; i++) {
        if (index !== null && index === i) {
          return options.fn(tempArr[i]);
        }
        ret = ret + options.fn(tempArr[i]);
      }

      return ret;
    }
  }
};


/**
 * generate random id for partial page load content-container
 * @type {{helper: helper}}
 */
exports.uniqueID = {
  helper: function () {

    var guid = (function () {

      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      }

      var curTS = new Date().getTime();
      curTS = curTS.toString(36);

      return function () {
        return curTS + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
      };
    })();

    return 'rID' + guid();
  }
};


/**
 * Conditional for determining if the character length of a string
 * is greater than the provided max value.
 * {{#chrGt someString 10}}...{{/chrGt}}
 *
 * @param {string} Any string.
 * @param {int}    The max number of characters.
 */


exports.chrGt = {
  helper: function (str, length, options) {
    if (str.length > length) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  }
};


/**
 * Conditional for determining if the character length of a string
 * is less than the provided min value.
 * {{#chrLt someString 10}}...{{/chrLt}}
 *
 * @param {string} Any string.
 * @param {int}    The min number of characters.
 */


exports.chrLt = {
  helper: function (str, length, options) {
    if (str.length < length) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  }
};
