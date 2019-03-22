const Review =require('../models/reviews');
const User = require('../models/users');
const { cloudinary } = require('../cloudinary');


module.exports = {
    asyncErrorHandler: (fn) =>
        (req, res, next) => {
            Promise.resolve(fn(req, res, next))
                .catch(next);
        },
    isReviewAuthor: async (req, res, next) => {
        let review = await Review.findById(req.params.review_id);
        if (reviewauthor.equals(req.user._id)) {
            return next();
        }
        req.session.error = "Goodbye";
        return res.redirect('/');
    },


    isValidPassword: async (req, res, next) => {
        const { user } = await User.authenticate()(req.user.username, req.body.currentPassword);
        if (user) {
            // add user to res.locals
            res.locals.user = user;
            next();
        } else {
            middleware.deleteProfileImage(req);
            req.session.error = 'Incorrect current password!';
            return res.redirect('/profile');
        }
    },
    changePassword: async (req, res, next) => {
        const {
            newPassword,
            passwordConfirmation
        } = req.body;

        if (newPassword && !passwordConfirmation) {
            middleware.deleteProfileImage(req);
            req.session.error = 'Missing password confirmation!';
            return res.redirect('/profile');
        } else if (newPassword && passwordConfirmation) {
            const { user } = res.locals;
            if (newPassword === passwordConfirmation) {
                await user.setPassword(newPassword);
                next();
            } else {
                middleware.deleteProfileImage(req);
                req.session.error = 'New passwords must match!';
                return res.redirect('/profile');
            }
        } else {
            next();
        }
    },
    deleteProfileImage: async (req) => {
        if (req.file) await cloudinary.v2.uploader.destroy(req.file.public_id);
    }
}