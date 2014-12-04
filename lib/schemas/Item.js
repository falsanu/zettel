
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = Schema({
  name: String,
  alreadyBought: Boolean
});

module.exports = ItemSchema;