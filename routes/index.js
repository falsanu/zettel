/**
 * Created by janfanslau on 04.12.14.
 *
 * Index Router
 */
'use strict';

var express = require('express');
var router = express.Router();
var Zettel = require('./../lib/models/Zettel');

/**
 * Shows the Homepage
 * - shows a list of public zettel
 * todo: make showing of public zettel configurable
 * @param req
 * @param res
 * @param next
 */
function indexAction(req, res, next) {
  Zettel.find({private: false}).lean().exec(function (err, zettel) {
    res.render('index', {title: 'Welcome to the future', zettel: zettel});
  });
}


router.get('/', indexAction);

module.exports = router;
