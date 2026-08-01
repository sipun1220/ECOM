const mongoose = require("mongoose");
const Review = require('./review.js');
const { ref } = require("joi");


const listingSchema = new mongoose.Schema({
title: {
   type: String,
   required: true
},
    
description: {
    type: String,
    required: true
},
image: {
    type: {
        url: String,
        filename: String,
    },
},
price: {
    type: Number,
   
},
location: {
    type: String,
  
},
country: {
    type: String,
   
},
reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    }
 
],
owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
   
},
   
});

listingSchema.post('findOneAndDelete', async function (listing) {
    
    if (listing) {
        await Review.deleteMany({
            _id: {
                $in: listing.reviews
            }
        });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;