/**
 * Created by janfanslau on 06.11.14.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ZettelSchema = require('./Zettel');
var _ = require('underscore');
var bcrypt = require(bcrypt);
var SALT_WORK_FACTOR = 10;

var UserSchema = Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  lists: [ZettelSchema]
});
//
UserSchema.pre('save', function (next) {
  var user = this;
// only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

// generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});
//

module.exports = UserSchema;


