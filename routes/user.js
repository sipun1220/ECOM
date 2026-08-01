const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require('../controllers/users.js');


router.route("/signup")
.get( userController.signupForm)
.post( wrapAsync(userController.signup));


router.route("/login")
.get(userController.loginForm)
.post(saveRedirectUrl,passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }),userController.login);


//logout route to log out the user and redirect them to the home page.
router.get("/logout", userController.logout);

module.exports = router;