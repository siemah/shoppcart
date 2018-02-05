let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let expressHbs = require('express-handlebars');
let mongoose = require('mongoose');
let session  = require("express-session");
let flash    = require('connect-flash');
let passport = require('passport');
let validator= require('express-validator');

let app = express();

// view engine setup
//set template engine to hbs powerfull one
app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: ".hbs"}));
app.set('view engine', '.hbs');
//app.set('views', path.join(__dirname, 'views'));

//connection to mongodb
mongoose.connect('mongodb://localhost:27017/shoppcart', err => {
  if ( err ) throw new Error("Error");
  console.log("connection");
});
mongoose.Promise = global.Promise;
//include a passport strategy
require('./config/passport');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret: "dayen",
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
