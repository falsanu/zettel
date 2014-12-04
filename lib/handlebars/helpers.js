///**
// * @module ViewHelpers
// */
//'use strict';
//
//var fs = require('fs');
//var path = require('path');
//var _ = require('underscore');
//
///**
// * Registers view helpers and there constants.
// *
// * @param helpers {Array}
// * @param handlebars {hbs}
// * @param app {Express}
// * @private
// */
//var registerHelpers = function (helpers, handlebars, app) {
//
//  for (var i = 0, u = helpers.length; i < u; i++) {
//    var container = helpers[i];
//    container.handlebars = handlebars;
//
//    var helperKeys = _.without(Object.keys(container), '__name__');
//    for (var hI = 0, hU = helperKeys.length; hI < hU; hI++) {
//      var helperName = helperKeys[hI];
//      var helper = container[helperName];
//      if (_.isObject(helper)) {
//        Logger.debug('Registering view helper "%s:%s"', container.__name__, helperName);
//
//        if (app && app.locals && helper.constants) {
//          var constantKeys = Object.keys(helper.constants);
//          for (var cI = 0, cU = constantKeys.length; cI < cU; cI++) {
//            var constantName = constantKeys[cI];
//            var constantValue = helper.constants[constantName];
//            if (constantName && constantValue) {
//              app.locals[constantName] = constantValue;
//            }
//          }
//        }
//
//        if (helper.helper && _.isFunction(helper.helper)) {
//          handlebars.registerHelper(helperName, helper.helper);
//        }
//      }
//    }
//
//  }
//
//};
//
///**
// * Registers all known view helpers.
// *
// * @param handlebars {hbs}
// * @param app {Express}
// * @param callback {doneCallback}
// */
//module.exports.register = function (handlebars, app, callback) {
//
//  if (handlebars && handlebars.registerHelper) {
//
//    var allHelpers = [];
//    var basedir = path.join(__dirname, 'helpers');
//    fs.readdir(basedir, function getAllHelperFiles(err, files) {
//      if (files) {
//
//        for (var i = 0, u = files.length; i < u; i++) {
//          var filename = files[i];
//
//          var helper = require(path.join(basedir, filename));
//          if (helper) {
//            helper.__name__ = filename.replace(path.extname(filename), '');
//            allHelpers.push(helper);
//          }
//        }
//
//        registerHelpers(allHelpers, handlebars, app);
//        if (_.isFunction(callback)) {
//          callback(err);
//        }
//
//      }
//    });
//  }
//};

'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('underscore');

module.exports.loadHelpers = function (app) {
  var helpers = {},
    basedir = path.join(__dirname, 'helpers');

  _.each(fs.readdirSync(basedir), function loadHelper(filepath) {
    var helperContainer = require(path.join(basedir, filepath));
    _.each(Object.keys(helperContainer), function(helperName) {
      var helper = helperContainer[helperName];
      if (!helper || !helper.helper || !_.isFunction(helper.helper)) {
        // skip anything but a helper function
        return;
      }

      helpers[helperName] = helper.helper;

      // inject helper's constants to locals
      if (helper.constants) {
        _.each(Object.keys(helper.constants), function handleConstant(constant) {
          app.locals[constant] = helper.constants[constant];
        });
      }
    });
  });

  return helpers;
};