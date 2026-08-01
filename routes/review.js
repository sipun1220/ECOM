const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema,reviewSchema } = require('../schema.js');
const Review = require('../models/review.js');
const listing = require('../models/listing.js');
const {validateReview} = require('../middleware.js');
const { isLoggedIn } = require('../middleware.js');
const { isReviewOwner } = require('../middleware.js');
const reviewController = require('../controllers/reviews.js');

//route to make a review for a listing
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId", isLoggedIn,isReviewOwner, wrapAsync(reviewController.deleteReview));

module.exports = router;