const Review =require('../models/reviews');

module.exports = {
    asyncErrorHandler: (fn) =>
        (req, res, next) => {
            Promise.resolve(fn(req, res, next))
                .catch(next);
        },
    isReviewAuthor: async(req, res, next) => {
        let review = await Review.findById(req.params.review_id);
        if(reviewauthor.equals(req.user._id)){
            return next();
        }
         req.session.error = "Goodbye";
        return res.redirect('/');
    }
}