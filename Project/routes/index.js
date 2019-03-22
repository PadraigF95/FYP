var express = require('express');
var router = express.Router();
var User = require('../models/users');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var async = require('async');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var crypto = require('crypto');
//var flash = require('connect-flash');
//var xoauth2 = require('xoauth2');
var passport = require ('passport');
//var api = require('./config/api');
var LocalStrategy = require('passport-local').Strategy;
//var USER_KEY = '47a6def808445c928fc853ff4dc8b30d';
var axios = require('axios');
const flatted = require('flatted');
var request = require('request');

const {
    updateProfile
} = require('../controllers');

const {
    asyncErrorHandler,
    isValidPassword,
    changePassword
} = require('../middleware')


//axios({
   // url: "https://api-v3.igdb.com/search",
   // method: 'POST',
    //headers: {
       // 'Accept': 'application/json',
       // 'user-key': '47a6def808445c928fc853ff4dc8b30d'
   // },
   // data: "fields alternative_name,character,collection,company,description,game,name,person,platform,popularity,published_at,test_dummy,theme;"
//})
   // .then(response => {
      //  console.log(response.data);
   // })
  //  .catch(err => {
       // console.error(err);
   // });




mongoose.connect ('mongodb://admin:admin2019@ds251894.mlab.com:51894/final');


var options = {

    url: 'https://api-v3.igdb.com/games/?fields=aggregated_rating,name,cover.url,genres.name,summary,screenshots.url,total_rating,videos.name; sort popularity desc' ,

    headers: {
        "user-key":"47a6def808445c928fc853ff4dc8b30d"
    },
    dataType:"jsonp",
};

var options2 ={

    url: 'https://api-v3.igdb.com/pulses/?fields=author,image,title,summary; sort popularity desc' ,
    headers: {
        "user-key":"47a6def808445c928fc853ff4dc8b30d"
    },
    dataType:"jsonp",

};

/*var options2 = {

    url: 'https://api-v3.igdb.com/reviews/?fields=url,game,content; sort popularity desc',
    headers: {
        "user-key":"47a6def808445c928fc853ff4dc8b30d"
    },
    dataType:"jsonp",
};*/

/* GET home page. */
router.get('/', function(req, res, next) {


    request(options,(error, response) => {
        if (error) {
            res.sendStatus(504);
        } else {
            let games = JSON.parse(response.body);
            console.log(response.data);
            res.render('index', { title: 'Hello World', user: req.user, games:games});
        }
    })
});







/*var options2 = {

    url: 'https://api-v3.igdb.com/games/?fields=name,release_date,reviews',
    headers: {
        "user-key":"47a6def808445c928fc853ff4dc8b30d"
    },
    dataType:"jsonp",
};*/

router.get('/games', function(req, res, next) {
    var options1 = {

        url: 'https://api-v3.igdb.com/games/?fields=aggregated_rating,name,cover.url,genres.name,total_rating,videos.name; sort popularity desc',
        headers: {
            "user-key": "47a6def808445c928fc853ff4dc8b30d"
        },
        dataType: "jsonp",
    };

    request(options1, (error, response) => {
        if (error) {
            res.sendStatus(504);
        } else {
            let ok = JSON.parse(response.body);
            console.log(response.data);
            res.render('game_details', {games: ok});


        }
    })
});







router.get('/register1', function(req, res) {

    res.render('#/register1');
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

    res.render('#/login');
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

//create isLoggedIn middleware
router.get('/profile', function(req, res){
      res.render('profile')
});

router.put('/profile',
    asyncErrorHandler(isValidPassword),
    asyncErrorHandler(changePassword),
    asyncErrorHandler(updateProfile)
);



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
                port: 587,
                secure: false,
                auth: {

                    user: 'padraigf95@gmail.com',
                    pass: 'Padraigf95//'


                },
                tls: {
                    rejectUnathorized: false
                }
            });




            var mailOptions = {
                to: user.email,
                from: '"Padraig Foran" <padraigf95@gmail.com' ,
                subject: 'Node.js Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };

            transporter.sendMail(mailOptions, function(err) {

                     console.log('mail sent');
                     req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                     done(err, 'done');
                });


        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/#/');
    });
});


router.get('/reset/:token', function(req, res) {
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, function (err, user) {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('#/forgot1');
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
                        user.password = req.body.password;
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save(function(err) {
                            req.logIn(user, function(err) {
                                done(err, user);
                            });
                        });
                    });
                },
        function(user, done) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false,
        auth: {

            user: 'padraigf95@gmail.com',
            pass: 'padraigf95123'


        },
        tls: {
            rejectUnathorized: false
        }
    });




    var mailOptions = {
        to: user.email,
        from: '"Padraig Foran" <padraigf95@gmail.com' ,
        subject: 'Your password has been changed',
        text:  'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
    };


    transporter.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);

    });
}
], function(err) {
    if (err) return next(err);
    res.redirect('/#/');
});
});

router.get('/forgotusername', function(req, res) {
    res.render('#/forgotusername', {
        user: req.user
    });
});

router.post('/forgotusername', function(req, res, next) {
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
                    return res.redirect('/#/forgotusername');
                }

                user.resetUsernameToken = token;
                user.resetUsernameExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                port: 587,
                secure: false,
                auth: {

                    user: 'padraigf95@gmail.com',
                    pass: 'padraigf95123'


                },
                tls: {
                    rejectUnathorized: false
                }
            });




            var mailOptions = {
                to: user.email,
                from: '"Padraig Foran" <padraigf95@gmail.com' ,
                subject: 'Node.js Username Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the username for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/resetusername/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };

            transporter.sendMail(mailOptions, function(err) {

                console.log('mail sent');
                req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            });


        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/#/');
    });
});

router.get('/resetusername/:token', function(req, res) {
    User.findOne({resetUsernameToken: req.params.token, resetUsernameExpires: {$gt: Date.now()}}, function (err, user) {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('#/forgotusername');
        }
        res.render('resetusername', {token: req.params.token});
    });

});


router.post('/resetusername/:token', function(req, res) {
    async.waterfall([
        function (done) {
            User.findOne({
                resetUsernameToken: req.params.token,
                resetUsernameExpires: {$gt: Date.now()}
            }, function (err, user) {
                if (!user) {
                    req.flash('error', 'Username reset token is invalid or has expired.');
                    return res.redirect('back');
                }
                user.username = req.body.username;
                user.resetUsernameToken = undefined;
                user.resetUsernameExpires = undefined;

                user.save(function (err) {
                    req.logIn(user, function (err) {
                        done(err, user);
                    });
                });
            });
        },
        function (user, done) {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                port: 587,
                secure: false,
                auth: {

                    user: 'padraigf95@gmail.com',
                    pass: 'padraigf95123'


                },
                tls: {
                    rejectUnathorized: false
                }
            });


            var mailOptions = {
                to: user.email,
                from: '"Padraig Foran" <padraigf95@gmail.com',
                subject: 'Your Username has been changed',
                text: 'This is a confirmation that the username for your account ' + user.email + ' has just been changed.\n'
            };


            transporter.sendMail(mailOptions, function (err) {
                req.flash('success', 'Success! Your username has been changed.');
                done(err);

            });
        }
    ], function (err) {
        if (err) return next(err);
        res.redirect('/#/');
    });

});





module.exports = router;