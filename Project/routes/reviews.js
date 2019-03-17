var express = require('express');
var router = express.Router({mergeParams:true});
const{asyncErrorHandler, isReviewAuthor} = require('../middleware');
const{
    reviewCreate,
    reviewUpdate,
    reviewDestroy
} = require('../controllers/reviews');

router.post('/', asyncErrorHandler(reviewCreate) );

/* PUT reviews update /posts/:id/reviews/:review_id */
router.put('/:review_id',isReviewAuthor, asyncErrorHandler(reviewUpdate));

/* DELETE reviews destroy /posts/:id/reviews/:review_id */
router.delete('/:review_id', isReviewAuthor, asyncErrorHandler(reviewDestroy));