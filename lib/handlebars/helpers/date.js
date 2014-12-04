'use strict';

var _ = require('underscore');
var moment = require('moment');

var isYesterday = function (date) {

  var midnight = new moment();
  midnight.hour(0);
  midnight.minute(0);
  midnight.second(0);
  midnight.milliseconds(0);

  var datesMidnight = new moment(date);
  datesMidnight.hour(0);
  datesMidnight.minute(0);
  datesMidnight.second(0);
  datesMidnight.milliseconds(0);

  return (datesMidnight.diff(midnight, 'minutes') === (-60 * 24));

};

var isToday = function (date) {

  var midnight = new moment();
  midnight.hour(0);
  midnight.minute(0);
  midnight.second(0);
  midnight.milliseconds(0);

  var datesMidnight = new moment(date);
  datesMidnight.hour(0);
  datesMidnight.minute(0);
  datesMidnight.second(0);
  datesMidnight.milliseconds(0);

  return (datesMidnight.isSame(midnight));
};

var isTomorrow = function (date) {

  var midnight = new moment();
  midnight.hour(0);
  midnight.minute(0);
  midnight.second(0);
  midnight.milliseconds(0);

  var datesMidnight = new moment(date);
  datesMidnight.hour(0);
  datesMidnight.minute(0);
  datesMidnight.second(0);
  datesMidnight.milliseconds(0);

  var diff = datesMidnight.diff(midnight, 'minutes');
  return (diff === (60 * 24));

};

exports.date = {
  constants: {
    LT:   'LT',
    L:    'L',
    l:    'l',
    LL:   'LL',
    ll:   'll',
    LLL:  'LLL',
    lll:  'lll',
    LLLL: 'LLLL',
    llll: 'llll',
    D: 'D',
    M: 'M',
    MM: 'MM',
    MMM: 'MMM',
    MMMM: 'MMMM'
  },

  helper:    function (object, format) {
    var locale = this.locale || this.locals.locale;
    if (locale && object) {
      var value = moment(object);


      value.lang(locale.code);
      var formatted = null;

      if (!_.isString(format)) {
        if (isToday(value)) {
          formatted = locale.__('today');
        } else if (isTomorrow(value)) {
          formatted = locale.__('tomorrow');
        } else if (isYesterday(value)) {
          formatted = locale.__('yesterday');
        } else {
          format = 'LL';
        }
      }

      if (!formatted) {
        formatted = value.format(format);
      }

      return formatted;

    } else {
      Logger.error('Time helper could not find locale object.');
      return '00:00';
    }
  }
};

exports.time = {
  helper: function (object, format) {
    if (!_.isString(format)) {
      format = 'LT';
    }
    return exports.date.helper.apply(this, [object, format]);
  }
};