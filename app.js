var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var passport = require('passport');
var expressHbs = require('express-handlebars');
var session = require('express-session');

var flash = require('connect-flash');
var socket_io = require('socket.io');

require('./config/passport')(passport);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');
var apiAuthRouter = require('./routes/auth.api');


var app = express();

var io=  socket_io();
app.io = io;



// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs',expressHbs({defaultLayout: 'layout',extname:'.hbs'}));
app.set('view engine', '.hbs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret:'vidyapathaisalwaysrunning',
    resave:true,
    saveUninitialized:true
}));
app.use(passport.initialize());
app.use(passport.session()); //persistent login sessions
app.use(flash());

// Make io accessible to our router
app.use(function(req,res,next){
    req.io = io;
    next();
});

io.on('connection', (socket) => {

    console.log('user connected')
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/api/users', apiAuthRouter);

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
