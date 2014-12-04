/**
 * Created by janfanslau on 06.11.14.
 */
var mongoose = require('mongoose');
var UserSchema = require('./../schemas/User');
var User = mongoose.model('User', UserSchema);


module.exports = User;