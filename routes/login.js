const express = require('express');
const router = express.Router();
const routes = require('../models/routes');
const User = require('../models/signup');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const secret = process.env.JWT_SECRET;
const verifyToken = require('../utils/verifyToken');
const preventCache = require('../utils/preventCache');






router.get("/login",(req,res)=>{

    res.render("login");
  })

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    if (email === "" || password === "") {
      return res.send("Please enter all the fields");  // Return after sending the response
    }
  
    try {
      const user = await User.findOne({ email, password });
  
      if (!user) {
        console.log(req.body);
        return res.send("Invalid Credentials");  // Return after sending the response
      }
  
      const token = jwt.sign(
        { userId: user._id, userEmail: user.email, routeId: user.route_id },
        secret,
        { expiresIn: '1h' }
      );
  
      res.cookie('token', token);
      return res.redirect("/app/login/home");  // Ensure the response is sent only once
    } catch (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");  // Send error response and return
    }

  });
 

  
  router.get("/login/home", verifyToken,preventCache, async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      let route =null;
      
    if (user && user.route_id) {
      // Fetch route details if the user is registered for a route
      route = await routes.findById(user.route_id);
      // console.log('Fetched route details:', route);
    } else {
      console.log('User does not have a registered route.');
    }
      
      // console.log(route);
      res.render("home", {
        
        user,
        
        route,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
  });
router.get('/logout',(req,res)=>{
      res.clearCookie('token');
      
      res.redirect('/');
  })

module.exports = router;