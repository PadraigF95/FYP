var express = require('express');
var router = express.Router();
var User = require('../models/users');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var passport = require ('passport');

mongoose.connect ('mongodb://admin:admin2019@ds251894.mlab.com:51894/final');


/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Hello World' });
});





router.post('/register1', function(req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var passwordconf = req.body.passwordconf;

    var newuser = new User();
    newuser.username = username;
    newuser.email = email;
    newuser.password = password;
    newuser.passwordconf = passwordconf;

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newuser.password,  salt, function (err, hash) {
            if (err) {
                console.log(err);
            }
            newuser.password = hash;
            newuser.passwordconf = hash;
            newuser.save(function (err) {
                if (err) {
                    console.log(err);
                    return res.status(500).send();
                } else {

                    res.redirect('/#/login');
                  //  db.query('Select LAST_INSERT_ID() as user_id,', function(error, results, fields) {
                       // if(err) throw err;

                       // var user_id = results[0];


                       // console.log(results[0]);

                       // req.login(results[user_id], function(err){
                           // res.redirect('/#/')

                        //});


                   // });

                }

            });

        });

    });
});

//passport.serializeUser(function(user_id, done){
   // done(null, user_id);
//});

//passport.deserializeUser(function(user_id, done) {
        //done(err, user_id);
   // });


router.post('/login', function (req,res) {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({email: email, password: password}, function (err, user){

        if(err){

            console.log(err);
            return res.status(500).send();
        }
        if(!user) {
            return res.status(404).send();
        }

        else{
            req.session.user = user;
            res.redirect('/#/');
        }
    })
});


router.get('/profile', function(req, res){
        if(!req.session.user){
            return res.status(401).send();
        }

        return res.status(200).send('This is working as intended');
})


    router.get('/logout', function (req, res){
        req.logout();
        req.session.destroy();
        res.redirect('/#/')

    });

    router.get('/', function(req, res){
        res.render('/#/', { username: req.body.username});
    });



module.exports = router;