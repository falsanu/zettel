'use strict';

var _ = require('underscore');

/**
 * If is a view helper which compares values.
 *
 * @function
 * @param value1 {*}
 * @param [modifier] {String}
 */
exports.if = {
  constants: {
    eq:       '==',
    gt:       '>',
    gte:      '>=',
    lt:       '<',
    lte:      '<=',
    uneq:     '!=',
    not:      'not',
    strict:   '!!',
    lengthOf: 'lengthOf'
  },
  helper:    function (a, modifier, cmp, b, options) {
    if (arguments.length === 4) {
      // missing modifier
      options = b;
      b = cmp;
      cmp = modifier;
      modifier = null;
    } else if (arguments.length === 3) {
      // missing modifier && cmp
      // we default to equality
      options = cmp;
      b = modifier;
      modifier = null;
      cmp = '==';
    } else if (arguments.length === 2) {
      // only one value
      // we can handle this early
      options = modifier;
      modifier = null;
      if (_.isArray(a)) {

        // if it an array we return true of there are elements
        if (a.length > 0) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }

      } else if (a) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    }

    var strict = (modifier === '!!');

    var result = true;

    switch (cmp.toUpperCase()) {

      case '==':
        /* jshint eqeqeq: false */
        result = (strict)
          ? (a === b)
          : (a == b);
        break;

      case '>':
        result = (a > b);
        break;

      case '>=':
        result = (a >= b);
        break;

      case '<':
        result = (a < b);
        break;

      case '<=':
        result = (a <= b);
        break;

      case '!=':
        /* jshint eqeqeq: false */
        result = (strict)
          ? (a !== b)
          : (a != b);
        break;

      case 'lengthOf'.toUpperCase():
        if (_.has(a, 'length')) {
          result = (a.length === b);
        } else if (_.isFunction(a.length)) {
          result = (a.length() === b);
        } else {
          result = false;
        }
        break;

    }

    if (modifier === 'not') {
      result = !result;
    }

    if (result) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }

  }
};