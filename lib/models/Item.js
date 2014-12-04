/**
 * Created by janfanslau on 05.11.14.
 */


var mongoose = require('mongoose');
var ItemSchema = require('./../schemas/Item');
var Item = mongoose.model('Item', ItemSchema)

module.exports = Item;

