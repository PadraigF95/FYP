//var users = require('../models/users');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
//var bcrypt = require('bcryptjs');
var request = require('request');

mongoose.connect  ('mongodb://admin:admin2019@ds251894.mlab.com:51894/final');

var db = mongoose.connection;




router.get('/', function(req, res, next) {

});



router.get('/games2/:id', function(req, res) {


    var options2= {

        url:  'https://api-v3.igdb.com/games/'+ req.params.id +'/?fields=aggregated_rating,name,cover.url,genres.name,summary,screenshots.url,platforms.name,artworks.url,platforms.platform_logo.url,total_rating,videos.video_id,videos.name; ',
        headers: {
            "user-key":"47a6def808445c928fc853ff4dc8b30d",

        },
        dataType:"jsonp",
    };

    request(options2, (error, response2) => {
        if (error) {
            res.sendStatus(504);
        } else {
            let game = JSON.parse(response2.body );
            console.log(response2.body);


            res.render('_id', { game : game  });


        }
    })
});
module.exports = router;











