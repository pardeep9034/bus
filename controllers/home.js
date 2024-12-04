const routes = require("../models/routes");
const User = require("../models/user");
const registeredRoute = require("../models/registeredroute");
module.exports.route=async(req,res)=>{
    const allRoutes = await routes.find({});
    res.render("./home/routes",{allRoutes,});
}
module.exports.profile=async(req,res)=>{
    const user = await User.findById(req.user._id);
    res.render("./home/profile",{user});
}
module.exports.registerPage=async(req,res)=>{
    const { id } = req.params;
    const loggedInUserId = req.user._id; // Get the logged in user's ID
    // console.log(loggedInUserId);
    const user = await User.findById(loggedInUserId);
    const foundRoute = await routes.findById(id);
res.render("./home/register",{foundRoute,user});
    
}
module.exports.register=async (req, res) => {
    const { route_id, stopname } = req.body; // Extract data from the form
  
    
        // Check if user is logged in and get their ID from the session
        const userId = req.user._id; 
       
  
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
        if (req.user.route_id) {
            return res.status(400).send("You have already registered for a route.");
        }
  
        // Create a new registered route
        const newRegisteredRoute = new registeredRoute({
            route_id: route_id,
            user_id: userId,
            stop_name: stopname
        });
  
        // Save the registration
        await newRegisteredRoute.save();
        console.log(`User ${userId} registered to Route ${route_id} at Stop ${stopname}`);
        await User.findByIdAndUpdate(userId, { route_id: route_id, stop: stopname });
  
        // Redirect to the user's home page after successful registration
        // res.redirect(`/home/routes/register/${route_id}/checkout?stopname=${stopname}&userId=${userId}`);

        res.redirect("/app/login/home");
  
  }
  module.exports.search=async (req,res)=>{
    const query = req.body.query;
    const searchRoute = await routes.find({source:query});
    console.log(searchRoute);

    if(searchRoute.length==0){
        req.flash('error','No such route found');
        return res.redirect("/home/routes");
    }
    req.flash('success','  click on     ' +(searchRoute[0].route_name)+ '   to view the route');
    
res.redirect("/home/routes");
    


   } 
   module.exports.checkoutPage=async(req,res)=>{
    const { id } = req.params;
    const { stopname, userId } = req.query;

    
    res.render("./home/checkout",{id, stopname, userId});
   }
