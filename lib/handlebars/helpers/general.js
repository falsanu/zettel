'use strict';

var _ = require('underscore');

exports.length = {
  helper: function (value) {
    if (value.length) {
      if (_.isFunction(value.length)) {
        return value.length();
      } else {
        return value.length;
      }
    } else if (_.isObject(value)) {
      return Object.keys(value).length;
    } else {
      return 0;
    }
  }
};

exports.assign = {
  helper: function (key, value) {
    this[key] = value;
    return '';
  }
};


/**
 * Selects a html select box by given value
 * @param value {String}
 * @params options {String}
 */
exports.select = {
  helper: function (value, options) {
    return options.fn(this).replace(
      new RegExp(' value=\"' + value + '\"'),
      '$& selected="selected"'
    );
  }
};


/**
 * Selects a html radio group by given value
 * @param value {String}
 * @params inputs {String}
 */
exports.checked = {
  helper: function (value, inputs) {
    return inputs.fn(this).replace(
      new RegExp(' value=\"' + value + '\"'),
      '$& checked="checked"'
    );
  }
};

/**
 * write an Object or JSON to HMTL
 * @param value {Object}
 */
exports.writeObject = {
  helper: function (value) {
    return JSON.stringify(value);
  }
};

// removed due to bad practice: view should never be required to call methods
//
//exports.call = {
//  helper: function (object, method, args) {
//    if (!object || typeof(object) !== 'object') {
//      throw new Error('object required');
//    }
//
//    if (!method || !object[method] || typeof(object[method]) !== 'function') {
//      throw new Error('object doesn\'t have a method called ' + method);
//    }
//
//    args = Array.prototype.slice.call(arguments, 2, arguments.length - 1);
//
//    return object[method].apply(object, args);
//  }
//};