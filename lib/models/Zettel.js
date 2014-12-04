/**
 * Created by janfanslau on 06.11.14.
 */
var mongoose = require('mongoose');
var ZettelSchema = require('./../schemas/Zettel');
var Item = require('./Item');
var Zettel = mongoose.model('Zettel', ZettelSchema);


module.exports = Zettel;


