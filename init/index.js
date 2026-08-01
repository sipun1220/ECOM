const mongoose = require('mongoose');
const { data } = require('./data.js');
const listing = require('../models/listing.js');


 async function connectdb() {
   await mongoose.connect('mongodb://localhost:27017/ecom');
};

connectdb().then(async () => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

const initdb = async () => {
    await listing.deleteMany({});
    const seededData = data.map((obj) => ({ ...obj, owner: "6a657594cb83b800ce45e45e" }));
    await listing.insertMany(seededData);
    console.log("Database seeded");
    mongoose.connection.close();
}
initdb();
