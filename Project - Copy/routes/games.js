//var users = require('../models/users');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
//var bcrypt = require('bcryptjs');

mongoose.connect  ('mongodb://admin:admin2019@ds251894.mlab.com:51894/final');

var db = mongoose.connection;



db.on('error', function(err){
    console.log('Connection error',err);
});
db.once('open',function(){
    console.log('Connected to database:');
});


app.get('/games', function(req, res){
    var query = req.query.search;
    var url = '\n' + 'https://api-v3.igdb.com/games' + query + '0ef1a8b08f27e4c9283e4b1e5493f830';
    request(url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body)
            res.render('games', {data: data});
        }
    });
});
