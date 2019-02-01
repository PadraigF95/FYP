var express = require('express');
var router = express.Router();
var User = require('../models/users');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var async = require('async');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var crypto = require('crypto');
var flash = require('express-flash');
var xoauth2 = require('xoauth2');
var passport = require ('passport');
var LocalStrategy = require('passport-local').Strategy;
var port = process.env.port || 3000;

mongoose.connect ('mongodb://admin:admin2019@ds251894.mlab.com:51894/final');


/* GET home page. */
router.get('/', function(req, res) {


    res.render('index', { title: 'Hello World', user: req.user});
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
   // newuser.passwordconf = passwordconf;
   // if(req.body.AdminCode =='SecretCode123'){
       // newuser.isAdmin = true;
  //  }

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newuser.password,  salt,  function (err, hash) {
            if (err){
                console.log(err);
            }
            newuser.password = hash;

            newuser.save(function (err) {
                if (err) {
                    console.log(err);
                    return res.status(500).send();
                } else {
                    req.flash("Success You are now registered" + req.body.username);
                    res.redirect('/#/');


                }

            });

        });

    });
});

router.get('/login', function(req, res) {

    res.render('/login');
});


   // var username = req.body.username;
   // var password = req.body.password;


   // User.findOne({username: username}, function (err, user){

       // if(err){

           // console.log(err);
            //return res.status(500).send();
     //   }
      //  if(!user) {
           // return res.status(404).send();
       // }

passport.use(new LocalStrategy(function(username, password, done){
    // Match username
    let query = {username:username};
    User.findOne( query, function(err, user) {

        if (err) throw err;
        if (!user) {
            return done(null, false, {message: ' No user found'});
        }

        bcrypt.compare(password, user.password, function (err, isMatch) {

            if (err) throw err;
            if (isMatch) {
                return done(null, user);

            } else {
                return done(null, false, {message: ' Wrong password'});
            }
        });
    });
}));

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user){
        done(err, user);
    });
});

router.post('/login',
    passport.authenticate('local',{successRedirect:'/#/',      failureRedirect:'/#/login',failureFlash: true}),
    function (req,res) {

        res.redirect('/#/');
    });



      //  user.comparePassword(password, function(err, isMatch){
           // if(isMatch && isMatch == true) {
               // req.session.user = user;
               // res.redirect('/#/' );
          //  } else {
               // return res.status(401).send();
           // }
       // });


    //})
//});


router.get('/profile', function(req, res){
        if(!req.session.user){
            return res.status(401).send();
        }

        return res.status(200).send('This is working as intended');
});


    router.get('/logout', function (req, res){
        req.logout();
        req.session.destroy();
        res.redirect('/#/')

    });

    router.get('/forgot1', function(req, res) {
     res.render('#/forgot1', {
            user: req.user
        });
    });

router.post('/forgot1', function(req, res, next) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({ email: req.body.email }, function(err, user) {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/#/forgot1');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                port: 25,
                secure: false,
                auth: {
                        user: 'Padraigf95@gmail.com',
                        pass: "ultimateteam"


                    },

                    tls:{
                          rejectUnathorized: false
                    }
                });


            var mailOptions = {
                to: user.email,
                from: '"Padraig Foran" <Padraigf95@gmail.com' ,
                subject: 'Node.js Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };

                transporter.sendMail(mailOptions, function(err) {
                    if (err) {

                        return console.log(err);
                    }
            });
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/#/');
    });
});


router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        }
        res.render('reset', {token: req.params.token});
    });
});

router.post('/reset/:token', function(req, res) {
    async.waterfall([
        function(done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }
                if(req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, function(err) {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save(function(err) {
                            req.logIn(user, function(err) {
                                done(err, user);
                            });
                        });
                    })
                } else {
                    req.flash("error", "Passwords do not match.");
                    return res.redirect('back');
                }
            });
        },

        function(token, user, done) {

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                port: 25,
                secure: false,
                auth: {
                    user: 'Padraigf95@gmail.com',
                    pass: "ultimateteam"


                },

                tls:{
                    rejectUnathorized: false
                }
            });


            var mailOptions = {
                to: user.email,
                from: '"Padraig Foran" <Padraigf95@gmail.com' ,
                subject: 'Node.js Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };

            transporter.sendMail(mailOptions, function(err) {
                if (err) {

                    return console.log(err);
                }
            });
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/#/');
    });
});



module.exports = router;