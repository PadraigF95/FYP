
var Review = require('../models/reviews');

module.exports = {

    async reviewCreate(req, res, next) {

        let post = await Post.findById(req.params.id);

        req.body.review.author = req.user._id;

        let review = await Review.create(req.body.review);

        post.reviews.push(review);

        post.save();

        req.session.success = 'Review Created successfully';
        //make sure to change post route
        res.redirect(`/posts/${post.id}`);
    },

    async reviewUpdate(req, res, next) {
        Review.findByIdUpdate(req.params.review_id, req.body.review);
        req.session.success = 'Review updated';
        //make sure to change post route
        res.redirect(`/posts/${req.params.id}`);

    },

    async reviewDestroy(req, res, next) {
        await Post.findByIdAndUpdate(req.params.id, {
            $pull: {reviews: req.params.review_id}
        });
        await Review.findByIdAndRemove(req.params.review_id);

        req.session.success = 'Review deleted';
        //make sure to change post route
        res.redirect(`/posts/${req.params.id}`);
    }
};

