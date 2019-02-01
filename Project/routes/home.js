var games = require('../models/home');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


mongoose.connect ('mongodb://admin:admin2019@ds251894.mlab.com:51894/final');

var db = mongoose.connection;

db.on('error', function(err){
    console.log('Connection error',err);
});
db.once('open',function(){
    console.log('Connected to database:');
});


router.findAll = function(req, res) {

    games.find(function(err, games) {
        if (err)
            res.send(err);
        else
            res.json(games);
    });
}

router.findOne = function(req, res) {

    // Use the Donation model to find a single donation
    games.find({"_id": req.params.id}, function (err, games) {
        if (err)
            res.json({message: 'Donation NOT Found!', errmsg: err});
        else
            res.json(games);
    });
}

    router.addHome = function(req, res) {

        var games = new games();

        games.name = req.body.name;


        console.log('Adding game: ' + JSON.stringify(home));

        // Save the donation and check for errors
        games.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Game Added!', data: games });
        });

}






module.exports = router;