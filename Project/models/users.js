var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    passwordconf: {
        type: String
    },
    resetPasswordToken: {
        type:String
    },
    resetPasswordExpires: {
        type:Date
    },

    isAdmin:{
        type:Boolean,
        default: false
    }
});


UserSchema.methods.comparePassword = function  (candidatePassword, callback){
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch){
        if (err)return callback(err);
        callback(undefined, isMatch);
    });
};



var User = mongoose.model('User', UserSchema);
module.exports = User;