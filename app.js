var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var lessMiddleware = require('less-middleware');
var logger = require('morgan');
var fs = require('fs');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const routeManger = require('./routes/routeManger');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.bodyParse());
app.use(session({
  secret: 'user_secret',
  resave: false,
  saveUninitialized: true,
}));
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// 注册路由信息
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
routeManger.registerRouter(app);

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
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'), {flags: 'a'});
app.use(logger('combined', {stream: accessLogStream}));


module.exports = app;

// exports.setLogger = function (info) {
// };