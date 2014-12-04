/**
 * Created by janfanslau on 06.11.14.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ItemSchema = require('./Item');
var Item = require('../models/Item');
var _ = require('underscore');

var ZettelSchema = Schema({
  urlSlug: String,
  name: String,
  private: {type: Boolean, default: false},
  items: [ItemSchema]
});

ZettelSchema.statics.findByUrlSlug = function (urlSlug, lean, callback) {
  if (lean === true && !_.isFunction(lean)){
    return this.model('Zettel').findOne({urlSlug: urlSlug}).populate('items').lean().exec(callback);
  }else{
    return this.model('Zettel').findOne({urlSlug: urlSlug}).populate('items').exec(callback);

  }
};

ZettelSchema.methods.addItem = function (name, callback) {
  var that = this;
  Item.create({name: name}, function (err, item) {
    if (!err) {
      that.items.push(item);
      that.save(callback);
    }
  })
};

ZettelSchema.methods.removeItem = function(itemId, callback){
  var that = this;
  for (var i = 0; i < that.items.length; i++) {
    var obj = that.items[i].toObject();
    if(obj._id == itemId) {
      that.items.splice(i, 1);
      that.save(callback);
    }
  }
}
module.exports = ZettelSchema;


