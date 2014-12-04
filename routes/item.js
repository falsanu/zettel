var express = require('express');
var router = express.Router();
var Note = require('./../lib/models/Item.js');

var debug = require('debug')('zettel');

/* GET home page. */
router.get('/add', function(req, res) {
  //check params

  //create Note

  // save Note in db
  var n = new Note();
  n.name="test";
  n.alreadyBought = true;

  n.save(function(err, note){
    if(err) {
      debug(err);
    } else {
      res.send('writing done');
    }
  })

});

router.get('/remove/:itemId', function (req, res){

});

module.exports = router;
