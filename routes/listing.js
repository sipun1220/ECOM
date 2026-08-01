const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema,reviewSchema } = require('../schema.js');
const listing = require('../models/listing.js');
const Review = require('../models/review.js');
const {isLoggedIn} = require('../middleware.js');
const { isOwner } = require('../middleware.js');
const { validateListing } = require('../middleware.js');
const listingController = require('../controllers/listings.js');
const multer  = require('multer')
const { storage } = require('../cloudconfig.js');
const upload = multer({ storage })

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"), wrapAsync(listingController.createlisting));

//new route to display the form to create a new listing
router.get("/new", isLoggedIn,listingController.newListingForm);


router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"), wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.deletelisting));


//edit route to display the form to edit a listing
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListingForm));



module.exports = router;