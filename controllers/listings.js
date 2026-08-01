const listing = require('../models/listing');
const { normalizeListingBody } = require('../middleware.js');

module.exports.index = async (req, res) => {
    const alllistings = await listing.find({});
    res.render('listings/index.ejs', { alllistings: alllistings });
};
module.exports.newListingForm = (req, res) => {
    res.render('listings/new.ejs');
};
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const Listing = await listing.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('owner');
    if (!Listing) {
        req.flash("error", "you requested is not found!");
        return res.redirect("/listings");
    }
    res.render('listings/show.ejs', { listing: Listing });
};
module.exports.createlisting = async (req, res, next) => {
    const url = req.file.path;
    const filename = req.file.filename || req.file.originalname;
    const listingData = normalizeListingBody(req);
   const newListing = new listing(listingData);
    newListing.owner = req.user._id; 
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "Listing created successfully!");
    res.redirect("/listings");
};
module.exports.editListingForm = async (req, res) => {
    const { id } = req.params;
    const Listing = await listing.findById(id);
      if (!Listing) {
        req.flash("error", "you requested is not found!");
        return res.redirect("/listings");
    }
    res.render('listings/edit.ejs', { listing: Listing });
};
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let updated = await listing.findByIdAndUpdate(id,  {...req.body.listing});
    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename || req.file.originalname;
        updated.image = { url, filename };
        await updated.save();
    }
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};
module.exports.deletelisting = async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
};