/**
 * Created by janfanslau on 04.12.14.
 *
 * Account Routes
 *  - login
 *  - logout
 *  - register
 */


var express = require('express');
var router = express.Router();
var debug = require('debug')('zettel');

var User = require('./../lib/models/User');

var viewPath = 'account/';


/**
 * This is the login action
 * - get for showing the login-form
 * - post for doing all the mongoose stuff
 * @param req
 * @param res
 * @param next
 */
function loginAction(req, res, next) {
  res.render(viewPath + 'login');
}

/**
 * This is the logout action. As the name says, the user will be logged out
 * and redirected to a config given site
 * @param req
 * @param res
 * @param next
 */
function logoutAction(req, res, next) {
  res.render(viewPath + 'login');
}

/**
 * This actions does the registration stuff
 * - get for showing the registration formular
 * - post for storing the data into database
 *
 * If the registration is successful the user will be redirected to a config given site*
 *
 * @param req
 * @param res
 * @param next
 */
function registerAction(req, res, next) {

  if(req.method === 'POST') {
    req.assert('username', 'required').notEmpty();
    req.assert('email', 'valid email required').isEmail();
    req.assert('password', '6 to 20 characters required').len(6, 20);

    var errors = req.validationErrors(true);
    if (errors) {
      res.render(viewPath + 'register', {errors: errors});
      return;
    }

    var data = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    }

    User.create(data, function (err, user) {
      if (!err) {
        res.redirect('/user/' + data.username);
      } else {
        if(err.code === 11000){
          var errors = {};
          errors.username = {
            value:data.username,
            msg:'username already in use'
          };
        }
        res.render(viewPath + 'register', {errors:errors});
      }
    });
  }else{
    res.render(viewPath + 'register');
  }
}

router.get('/login', loginAction);
router.post('/login', loginAction);
router.get('/logout', logoutAction);
router.get('/register', registerAction);
router.post('/register', registerAction);

module.exports = router;