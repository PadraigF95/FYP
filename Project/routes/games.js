//var users = require('../models/users');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
//var bcrypt = require('bcryptjs');
var request = require('request');

mongoose.connect  ('mongodb://admin:admin2019@ds251894.mlab.com:51894/final');

var db = mongoose.connection;

var options2 = {

    url: 'https://api-v3.igdb.com/games/?fields=name,release_date,reviews',
    headers: {
        "user-key":"47a6def808445c928fc853ff4dc8b30d"
    },
    dataType:"jsonp",
};


router.get('/', function(req, res, next) {





});



router.get('/games1/:id', function(req, res, next) {
    var options2 = {

        url: 'https://api-v3.igdb.com/games/?fields=aggregated_rating,name,cover.url,genres.name,total_rating,videos.name; sort popularity desc' ,
        headers: {
            "user-key":"47a6def808445c928fc853ff4dc8b30d"
        },
        dataType:"jsonp",

    };
    request(options2, (error, response) => {
        if (error) {
            res.sendStatus(504);
        } else {
            let games = JSON.parse(response.body);
            console.log(response.data);
            res.render('/games1/:id', { games:games});



        }
    })
});

module.exports = router;











