var bodyparser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect ('mongodb://admin:admin2019@ds251894.mlab.com:51894/final');

var favouritesSchema = new mongoose.Schema({

    game: String
});

var Favourites = mongoose.model('Favourites',favouritesSchema );



//var data =[{game: 'Bloodborne'},{game: 'Persona 5'},{game: 'Skyrim'}];
var urlencodedParser = bodyparser.urlencoded({extended: false});


module.exports = function(app){


    app.get('/favourites', function(req, res){

        Favourites.find({}, function(err, data){

            if(err) throw err;
            res.render('favourites',{favourites:data});

        });

    });

    app.post('/favourites', urlencodedParser, function(req, res){

        var newFavourite = Favourites(req.body).save(function(err,data){

            if(err) throw err;
            res.json(data);
        });

    });

    app.delete('/favourites/:game', function(req, res){

        Favourites.find({game: req.params.game.replace(/\-/g, "")}).remove(function(err,data){

            if(err) throw err;
            res.json(data);
        });
        
    });




};

