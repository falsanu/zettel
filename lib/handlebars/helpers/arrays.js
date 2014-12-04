'use strict';

var _ = require('underscore');

module.exports.first = {
  helper: function (array) {
    if (_.isArray(array)) {
      return _.first(array);
    } else if (_.isObject(array)) {
      var lastKey = ( _.first(Object.keys(array)));
      return array[lastKey];
    } else {
      return '';
    }
  }
};

module.exports.last = {
  helper: function (array) {
    if (_.isArray(array)) {
      return _.last(array);
    } else if (_.isObject(array)) {
      var lastKey = ( _.last(Object.keys(array)));
      return array[lastKey];
    } else {
      return '';
    }
  }
};

module.exports.each = {
  helper: function (array, options) {

    var oddClass = null;
    var evenClass = null;
    var itemName = 'item';
    var indexName = 'index';
    var countName = 'count';
    var lastName = 'isLast';

    if (options && options.hash) {
      if (options.hash.oddClass) {
        oddClass = options.hash.oddClass;
      }
      if (options.hash.evenClass) {
        evenClass = options.hash.evenClass;
      }
      if (options.hash.item) {
        itemName = options.hash.item;
      }
      if (options.hash.index) {
        indexName = options.hash.index;
      }
      if (options.hash.count) {
        countName = options.hash.count;
      }
    }

    var output = '';

    if (_.isArray(array) && array.length > 0) {
      for (var i = 0, u = array.length; i < u; i++) {
        var item = _.clone(array[i]);
        item.isOdd = (((i + 1) % 2) === 1);
        item.isEven = !item.isOdd;

        if (item.isOdd) {
          item.rowClass = (oddClass)
            ? oddClass
            : '';
        } else {
          item.rowClass = (evenClass)
            ? evenClass
            : '';
        }

        this[itemName] = item;
        this[indexName] = i;
        this[countName] = u;
        this[lastName] = (i+1) === u;

        output += options.fn(this);

        delete this[itemName];
        delete this[indexName];
        delete this[countName];
        delete this[lastName];
        delete this.isOdd;
        delete this.isEven;
        delete this.rowClass;

      }
    } else {
      output += options.inverse();
    }

    return output;

  }
};


module.exports.isNthItem = {

  helper: function (options) {
    var index = options.data.root.index + 1,
      nth = options.hash.nth;

    if (index % nth === 0) {
      return options.fn(this);
    }
  }
};

module.exports.numberOfElements = {

  helper: function (array) {
    if (_.isArray(array) && array.length > 0) {
      return array.length;
    } else {
      return 0;
    }
  }
};