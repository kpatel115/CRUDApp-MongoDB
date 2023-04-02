var createError = require('http-errors');
var express = require('express');
var mongoose = require('mongoose')
var MongoClient = require('mongodb').MongoClient;
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var contactsRouter = require('./routes/contacts')

var app = express();
// MongoDB Connect
var uri = 'mongodb+srv://kpatel114:kpatel115@cluster542.ibmkweb.mongodb.net/?retryWrites=true&w=majority'

async function connect(){
  try {
    await mongoose.connect(uri);
    console.log('connected to MongoDB');
  } 
  catch {
    console.error(error);
  }
}

connect()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/contacts', contactsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
