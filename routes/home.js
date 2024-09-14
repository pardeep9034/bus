const express = require('express');
const router = express.Router();
const routes = require('../models/routes');
const User = require('../models/signup');
const verifyToken = require('../utils/verifyToken');
const preventCache = require('../utils/preventCache');
const registeredRoute = require('../models/registeredroute');

router.get('/',(req,res)=>{
    // res.send('Hello World');
    res.redirect("/app/login/home");
});

router.get("/routes",verifyToken,preventCache, async(req,res)=>{
    const allRoutes = await routes.find({});
    res.render("routes",{allRoutes});
})
router.get("/profile",verifyToken,preventCache,async(req,res)=>{
    const user = await User.findById(req.userId);
    res.render("profile",{user});
}
)
router.get("/routes/register/:id",verifyToken,preventCache,async(req,res)=>{
    const { id } = req.params;
    const loggedInUserId = req.userId; // Get the logged in user's ID
    // console.log(loggedInUserId);
    const user = await User.findById(loggedInUserId);
    const foundRoute = await routes.findById(id);
res.render("register",{foundRoute,user});
    
})
router.post("/routes/register/:id", verifyToken, async (req, res) => {
  const { route_id, stopname } = req.body; // Extract data from the form

  try {
      // Check if user is logged in and get their ID from the token
      const userId = req.userId; // This should be set by `verifyToken` middleware

      // Validate that all necessary data is available
      if (!route_id || !stopname) {
          return res.status(400).send("Route ID and Stop Name are required.");
      }

      // Check if user has already registered for this route
      const existingRegistration = await registeredRoute.findOne({
          route_id: route_id,
          user_id: userId
      });

      if (existingRegistration) {
          return res.status(400).send("You have already registered for this route.");
      }

      // Create a new registered route
      const newRegisteredRoute = new registeredRoute({
          route_id: route_id,
          user_id: userId,
          stop_name: stopname
      });

      // Save the registration
      await newRegisteredRoute.save();
      // console.log(`User ${userId} registered to Route ${route_id} at Stop ${stopname}`);
      await User.findByIdAndUpdate(userId, { route_id: route_id, stop: stopname });

      // Redirect to the user's home page after successful registration
      res.redirect("/app/login/home");
  } catch (err) {
      console.error("Error registering route:", err);
      res.status(500).send("Internal Server Error");
  }
});
module.exports = router;