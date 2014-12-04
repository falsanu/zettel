/**
 * Created by janfanslau on 04.12.14.
 *
 * Zettel Routes
 *  - /:zettelUrlSlug
 *  - logout
 *  - register
 */

var express = require('express');
var router = express.Router();
var debug = require('debug')('zettel');
var Zettel = require('./../lib/models/Zettel');

/**
 * Shows the Zettel with a given URL-Slug
 * @param req
 * @param res
 * @param next
 */
function zettelFromUrlSlugAction(req, res, next){
  var urlSlug = req.param('zettelUrlSlug');
  Zettel.findByUrlSlug(urlSlug, true, function (err, zettel) {
    if (err) {
      next(err);
    }
    if(!zettel){
      res.redirect('/'+ urlSlug + '/new')
    }
    else {
      res.render('zettel/list', {title: 'Express', zettel: zettel});
    }
  });
}

/**
 * Show the new Zettel form
 * @param req
 * @param res
 * @param next
 */
function createZettelFromUrlSlugAction(req, res, next) {
  var zettelUrlSlug = req.param('zettelUrlSlug');
  res.render('zettel/new', {title: 'Express', zettelUrlSlug: zettelUrlSlug});
}

/**
 * Saves the Zettel
 * @param req
 * @param res
 * @param next
 */
function saveNewZettelAction(req, res, next) {
  var zettelName = req.body.zettelName;
  var zettelUrlSlug = req.body.zettelUrlSlug;
  var zettelPrivate = req.body.zettelPrivate ? req.body.zettelPrivate : false;
  Zettel.create({
    name: zettelName,
    urlSlug: zettelUrlSlug,
    private: zettelPrivate
  }, function (err, zettel) {
    if (err) {
      res.send(err);
    } else {
      if (zettel) {

        res.redirect('/' + zettel.urlSlug);
      }
    }
  });
}

/**
 * Adds a item to a Zettel given by URLSlug
 * @param req
 * @param res
 * @param next
 */
function addItemToZettelByUrlSlugAction(req, res, next) {
  var name = req.body.itemName;
  Zettel.findByUrlSlug(req.param('zettelUrlSlug'), false, function (err, zettel) {
    zettel.addItem(name, function(err, zettel){
      res.redirect('/' + zettel.urlSlug);
    })
  });
}

/**
 * Removes an item from a zettel given by URLSlug
 * @param req
 * @param res
 * @param next
 */
function removeItemFromZettelByUrlSlugAction(req, res, next) {
  var itemId = req.param('itemId'),
    zettelUrlSlug = req.param('zettelUrlSlug');

  Zettel.findByUrlSlug(zettelUrlSlug, false, function (err, zettel) {
    zettel.removeItem(itemId, function(err, zettel){
      res.redirect('/' + zettel.urlSlug);
    })
  });
}

/* GET Items on listing. */
router.get('/:zettelUrlSlug', zettelFromUrlSlugAction);

router.get('/:zettelUrlSlug/new', createZettelFromUrlSlugAction);

router.post('/:zettelUrlSlug/new', saveNewZettelAction);

router.post('/:zettelUrlSlug/addItem', addItemToZettelByUrlSlugAction);

router.get('/:zettelUrlSlug/removeItem/:itemId', removeItemFromZettelByUrlSlugAction);



module.exports = router;
