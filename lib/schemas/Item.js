var debug = require('debug')('zettel');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = Schema({
  name: String,
  amount: String,
  alreadyBought: {type: Boolean, default: false}
});

ItemSchema.statics.setAsBought = function (id, value, callback) {


  //return this.model('Item').findOne({urlSlug: urlSlug}).populate('items').lean().exec(callback);
  this.model('Item').findById(id, function (err, item) {
    if (err) {
      debug(err);
      callback(err);
      return;
    }

    item.alreadyBought = value;
    item.save(callback);
  });
};

module.exports = ItemSchema;