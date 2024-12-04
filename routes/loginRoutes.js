const express = require("express");
const router = express.Router();
require("dotenv").config();
const wrapAsync = require("../utils/wrapAsync");
const preventCache = require("../utils/preventCache");
const { isloggedin, saveRedirecturl } = require("../utils/middelware");
const passport = require("passport");
const userController = require("../controllers/user");

router.get("/login", userController.loginPage);

router.post( "/login",
  saveRedirecturl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/app/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome to the home page");
    res.redirect(res.locals.redirectUrl || "/app/login/home");
  }
);


router.get("/login/home", isloggedin, preventCache, wrapAsync(userController.loginHome));
router.get("/logout",userController.logout); ;

module.exports = router;
