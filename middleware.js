const listing = require("./models/listing");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be signed in to do this !");
        return res.redirect("/login");
    }
    next();
};

const saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

const isOwner = async (req, res, next) => {
    const { id } = req.params;
    const Listing = await listing.findById(id);
    if (!Listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

const normalizeListingBody = (req) => {
    if (req.body?.listing) {
        return req.body.listing;
    }

    const listingData = {};
    for (const [key, value] of Object.entries(req.body ?? {})) {
        const match = key.match(/^listing\[(.+)\]$/);
        if (match) {
            listingData[match[1]] = value;
        }
    }

    return listingData;
};

const validateListing = (req, res, next) => {
    const listingData = normalizeListingBody(req);
    const { error } = listingSchema.validate({ listing: listingData });
    if (error) {
        let errorMessage = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errorMessage);
    }
    next();
};

//for validating the review data using joi schema
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        let errorMessage = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errorMessage);
    }
    next();
};

const isReviewOwner = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const foundReview = await Review.findById(reviewId);
    if (!foundReview.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
module.exports = { isLoggedIn, saveRedirectUrl, isOwner, validateListing, validateReview, isReviewOwner, normalizeListingBody };