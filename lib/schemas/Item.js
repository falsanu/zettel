
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = Schema({
  name: String,
  amount:[Number],
  alreadyBought: Boolean
});

module.exports = ItemSchema;