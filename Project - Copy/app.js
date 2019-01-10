

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require ('passport');
// New Code
var mongoose = require('mongoose');

var db = mongoose.connection;
mongoose.connect ('mongodb://admin:admin2019@ds251894.mlab.com:51894/final');

//mongoose.connect('mongodb://localhost:27017/gamesdb');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'gtfhdyjhgfjdhtxjuyu',
    resave: false,
    saveUninitialized: false,
    //cookie: { secure: true }
}))
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});


app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
});


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