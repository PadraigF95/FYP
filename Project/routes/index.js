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



var options= {

    url: 'https://api-v3.igdb.com/games/?fields=aggregated_rating,name,cover.url,genres.name,total_rating,videos.video_id,videos.name; sort popularity desc ',
    headers: {
        "user-key":"47a6def808445c928fc853ff4dc8b30d"
    },
    dataType:"jsonp",
};

var options1= {

    url: 'https://api-v3.igdb.com/pulses/?fields=author,category,created_at,ignored,image,published_at,pulse_image,pulse_source,summary,tags,title,uid,updated_at,videos,website.url; sort published_at desc',
    headers: {
        "user-key":"47a6def808445c928fc853ff4dc8b30d"
    },
    dataType:"jsonp",
};

var options3= {

    url: 'https://api-v3.igdb.com/games/?fields=aggregated_rating,name,cover.url,genres.name,total_rating,videos.video_id,videos.name; sort popularity:desc; where first_release_date>1554206400;',
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

    request(options, (error, response) => {
        request(options1, (error, response1) => {
            request(options3, (error, response3) => {

                if (error) {
                    res.sendStatus(504);
                } else {
                    let games = JSON.parse(response.body);
                    let games1 = JSON.parse(response1.body);
                    let coming_soon = JSON.parse(response3.body);


                    res.render('index', {user: req.user, games: games, games1: games1, coming_soon: coming_soon});


                }
            })
        })
    })


});











router.get('/games', function(req, res, next){

    axios({
        url: "https://api-v3.igdb.com/pulses",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': '47a6def808445c928fc853ff4dc8b30d'
        },
        data: "fields author,category,created_at,ignored,image,published_at,pulse_image,pulse_source.page.slug,summary,tags,title,uid,updated_at,videos,website.url;sort published_at desc;"
    })
        .then(response => {
            console.log(response.data);
            res.render('games', { title: 'Hello World', user: req.user, games1:response.data});
        })
        .catch(err => {
            console.error(err);
        });
});


router.get('/games1/:id', function(req, res) {


    var options2= {

        url:  'https://api-v3.igdb.com/games/'+ req.params.id +'/?fields=aggregated_rating,name,cover.url,genres.name,summary,screenshots.url,platforms.name,artworks.url,platforms.platform_logo.url,total_rating,videos.video_id,videos.name ',
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
            console.log(response2.body );


            res.render('_id', { game : game[0] });


        }
    })
});





router.get('/results',  function(req,res){


    if( req.query.search === undefined || "" ){
        console.log('Empty String received');
        var errorMessage = "No results found";
        res.send(errorMessage);

    } else {


        var search= {

            url: 'https://api-v3.igdb.com/games/?search='+ req.query.search+'&fields=name,cover.url,summary;',
            headers: {
                "user-key":"47a6def808445c928fc853ff4dc8b30d"
            },
            dataType:"jsonp",
        };

        request(search, (error, response4) => {
            if (error) {
                res.sendStatus(504);
            } else {
                let search = JSON.parse(response4.body );
                console.log(req.query.search );


                res.render('results', { search : search });


            }
        })



    }

});

router.get('/pricechecker', function(req,res){

    res.render('pricechecker');

});


router.get('/pricecheckerresults', function(req, res){

    var prices = {

        url:"https://api.isthereanydeal.com/v01/game/prices/?pretty&key=8746da4a2cc9ed6fbceaa12be510065eef1751d4&plains=" + req.query.search +"&shops=steam%2Cindiegamestand%2Camazonus",
        headers: {
            "Accept":"application/json"
        },

        dataType:"jsonp",
    };
    request(prices, (error, response5, body) => {
        if (error) {
            res.sendStatus(504);
        } else {

            let prices = JSON.parse(response5.body );
            console.log('Status:', response5.statusCode);
            console.log('Headers:', JSON.stringify(response5.headers));
            console.log('Response:', body);
            console.log(JSON.stringify(prices));
            console.log(req.query.search );





            res.render('pricecheckerresults', { prices:prices});


        }
    })





});



router.get('/findgames',  function(req,res){




        var findgames= {

            url: 'https://api-v3.igdb.com/games/?fields=name,cover.url,summary,genres.name,platforms.name,release_dates;',
            headers: {
                "user-key":"47a6def808445c928fc853ff4dc8b30d"
            },
            dataType:"jsonp",
        };

        request(findgames, (error, response6) => {
            if (error) {
                res.sendStatus(504);
            } else {
                let search = JSON.parse(response6.body );
                console.log(req.query.search );


                res.render('findgames', { search : search });


            }
        })





});

router.get('favourites', function(req,res){


    res.render('favourites');

});


router.get('/hello/:id', function(req, res){

    res.send('Its working ' + req.params.id);

});



router.get('/register1', function(req, res) {

    res.render('register1');
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
                    res.redirect('/');


                }

            });

        });

    });
});

router.get('/login', function(req, res) {

    res.render('login');
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
    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/login',
        failureFlash: true}),
    function (req,res,err) {
        console.log(err);

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

           res.send('This is working as intended');
});


    router.get('/logout', function (req, res){
        req.logout();
        req.session.destroy();
        res.redirect('/')

    });

    router.get('/forgot1', function(req, res) {
     res.render('forgot1', {
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
                    return res.redirect('/forgot1');
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
    res.redirect('/');
});
});

router.get('/forgotusername', function(req, res) {
    res.render('forgotusername', {
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
                    return res.redirect('/forgotusername');
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
        res.redirect('/');
    });

});


module.exports = router;