/**
 * Created by janfanslau on 06.11.14.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var ZettelSchema = require('./Zettel');
var _ = require('underscore');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var UserSchema = Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  email: { type: String, required: true },
  lists: [{type: mongoose.Schema.Types.ObjectId, ref: 'Zettel'}]
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

UserSchema.login = function (login, password){
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
    bcrypt.hash(password, salt, function (err, hash) {
      if (err) return next(err);

      this.model('User').findOne({username:login}, function(err, user){
        if (err) return next(err);
        bcrypt.compare(user.password, hash, function(err, res) {
          if (!err) {
            // wenn kein Fehler aufgetreten ist
            if (res === true) {
              // wenn das Passwort stimmt
              console.log('Das Passwort stimmt.');
              return user;
            } else {
              // wenn das Passwort falsch ist
              console.log('Das Passwort ist falsch.');
              next(new Error('Das Passwort ist falsch.'));
            }
          } else {
            // wenn ein Fehler aufgetreten ist
            console.log('Fehler: ' + hash);
            next(new Error('Fehler: ' + hash));
          }
        });
      });
    });
  });

};

module.exports = UserSchema;


