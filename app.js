if (process.env.NODE_ENV != "production") {
require('dotenv').config();
}

const dbUrl = process.env.DB_URL;


//project dependencies

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;

//mongoose models/tables
const listing = require('./models/listing.js');
const Review = require('./models/review.js');
const User = require('./models/user.js');

//utility functions
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');

//joi schemas for validation
const { listingSchema,reviewSchema } = require('./schema.js');


//routers for different routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


//middleware
app.use(methodOverride('_method')); 
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));



const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: process.env.SECRET,
    touchAfter: 24 * 3600 ,
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e);
});

//session configuration
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
};




//connect to the database

async function connectDB() {
    try {
        await mongoose.connect(dbUrl);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}
connectDB();


//root route 
// app.get('/', (req, res) => {
//     res.send('Hello World');
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware to set flash messages in res.locals
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

//catch all route for 404 errors
app.all('/{*any}', (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).render('error.ejs', {message:message});
});

//start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});