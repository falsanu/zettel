var express = require('express');
var expressValidator = require('express-validator');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var everyauth = require('everyauth');

var mongoose = require('mongoose');
var helpers = require(path.join(process.cwd(), 'lib/handlebars/helpers.js'));
var io = require('socket.io')();
var User = require('./lib/models/User');
/**
* todo: create routes array and iterate over it
* author: janfanslau
* date: 04.12.14
* time: 09:42
*/

var routes = require('./routes/index');
var accountRoute = require('./routes/account');
var itemRoute = require('./routes/item');
var zettelRoute = require('./routes/zettel');

everyauth.debug = true;

var usersById = {};
var nextUserId = 0;
function addUser (source, sourceUser) {
  var user;
  if (arguments.length === 1) { // password-based
    user = sourceUser = source;
    user.id = ++nextUserId;
    return usersById[nextUserId] = user;
  } else { // non-password-based
    user = usersById[++nextUserId] = {id: nextUserId};
    user[source] = sourceUser;
  }
  return user;
}
var usersByLogin = {
  'brian@example.com': addUser({ login: 'brian@example.com', password: 'password'})
};

//Everyauth Stuff

everyauth.everymodule
  .findUserById( function (id, callback) {
    callback(null, usersById[id]);
  });

everyauth
  .password
  .loginWith('email')
  .getLoginPath('/login')
  .postLoginPath('/login')
  .loginView('account/login')
//    .loginLocals({
//      title: 'Login'
//    })
//    .loginLocals(function (req, res) {
//      return {
//        title: 'Login'
//      }
//    })
  .loginLocals( function (req, res, done) {
    setTimeout( function () {
      done(null, {
        title: 'Async login'
      });
    }, 200);
  })
  .authenticate( function (login, password) {
    var errors = [];
    if (!login) errors.push('Missing login');
    if (!password) errors.push('Missing password');
    if (errors.length) return errors;

    var user = User.login(login, password);
    if (!user) return ['Login failed'];
    if (user.password !== password) return ['Login failed'];
    return user;
  })

  .getRegisterPath('/register')
  .postRegisterPath('/register')
  .registerView('account/register')
//    .registerLocals({
//      title: 'Register'
//    })
//    .registerLocals(function (req, res) {
//      return {
//        title: 'Sync Register'
//      }
//    })
  .registerLocals( function (req, res, done) {
    setTimeout( function () {
      done(null, {
        title: 'Async Register'
      });
    }, 200);
  })
  .validateRegistration( function (newUserAttrs, errors) {
    var login = newUserAttrs.login;
    if (usersByLogin[login]) errors.push('Login already taken');
    return errors;
  })
  .registerUser( function (newUserAttrs) {
    var login = newUserAttrs[this.loginKey()];

    User.create(data, function (err, user) {
      if (!err) {
        //res.redirect('/user/' + data.username);
        return usersByLogin[login] = user;
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


  })

  .loginSuccessRedirect('/')
  .registerSuccessRedirect('/');




var app = express();

// view engine setup
var hbs = exphbs({
  defaultLayout: 'default',
  layoutsDir: path.join(__dirname, 'views/layouts/'),
  partialsDir: path.join(__dirname, 'views/partials/'),
  helpers: helpers.loadHelpers(app),
  extname: 'hbs'
});
app.engine('.hbs', hbs);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views/templates/'));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
//app.use(express.bodyParser());

app.use(bodyParser.json());
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'öjasdfökaiofankd',
  resave: false,
  saveUninitialized: true
}));
app.use(everyauth.middleware(app));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Setup Handlebars locals
 */
app.use(function(req, res, next){
  res.locals.projectName = 'Zettel';
  next();
});

mongoose.connect('mongodb://localhost/zettel');



app.use('/', routes);
app.use(accountRoute);
app.use('/item', itemRoute);
app.use(zettelRoute);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
