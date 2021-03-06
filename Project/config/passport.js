var LocalStrategy = require('passport-local').Strategy;
var User = require ('../models/users');
var bcrypt = require('bcryptjs');
var config = require('../config/database')



module.exports = function(passport){

    passport.use(new LocalStrategy(function(username, password, done){
       // Match username

        User.findOne( function(err, user) {

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



}