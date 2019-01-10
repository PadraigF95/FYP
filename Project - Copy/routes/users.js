var users = require('../models/users');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.connect  ('mongodb://admin:admin2019@ds251894.mlab.com:51894/final');

var db = mongoose.connection;



db.on('error', function(err){
    console.log('Connection error',err);
});
db.once('open',function(){
    console.log('Connected to database:');
});


module.exports = users;






