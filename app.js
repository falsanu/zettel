var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');


var mongoose = require('mongoose');
var helpers = require(path.join(process.cwd(), 'lib/handlebars/helpers.js'));
var io = require('socket.io')();

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

var app = express();
//var routes = [
//  'index',
//  'account',
//  'item',
//  'zettel'
//];

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
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
