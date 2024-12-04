const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
require('dotenv').config();
const userController = require('../controllers/user');

router.get("/",userController.signupPage);
  router.post("/",wrapAsync(userController.signup));
  
  module.exports = router;