const express = require('express');
const router = express.Router();
const User = require('../models/signup');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET;

router.get("/",(req,res)=>{
    
    res.render('signup');
  });
  router.post("/",async(req,res )=>{
    const { name, email, password, roll_no } = req.body;
    try {
        const newUser = new User({ name, email, password, roll_no });
        const savedUser = await newUser.save();
  
        // Generate JWT
        const token = jwt.sign({ userId: savedUser._id }, secret, { expiresIn: '1h' });
  
        // Store JWT in cookie
        res.cookie('token', token, { httpOnly: true });
        res.redirect("app/login/home");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
   
  });
  module.exports = router;