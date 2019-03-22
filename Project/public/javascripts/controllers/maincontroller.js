var app = angular.module('GamesWebApp');
const util = require('util');
const { cloudinary } = require('../cloudinary');
const { deleteProfileImage } = require('../middleware');

//registration needs to be done
module.exports= {

    async updateProfile(req, res, next) {
        const {
            username,
            email
        } = req.body;
        const { user } = res.locals;
        if (username) user.username = username;
        if (email) user.email = email;
        if (req.file) {
            if (user.image.public_id) await cloudinary.v2.uploader.destroy(user.image.public_id);
            const { secure_url, public_id } = req.file;
            user.image = { secure_url, public_id };
        }
        await user.save();
        const login = util.promisify(req.login.bind(req));
        await login(user);
        req.session.success = 'Profile successfully updated!';
        res.redirect('/profile');
    }
}

