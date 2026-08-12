const listing = require('../models/listing.js');
const Review = require('../models/review.js');

module.exports.createReview = async (req, res) => {
    const foundListing = await listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user && req.user._id;
    await newReview.save();
    foundListing.reviews.push(newReview._id);
    await foundListing.save();
    req.flash("success", "Review added successfully!");
    res.redirect(`/listings/${foundListing._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
};