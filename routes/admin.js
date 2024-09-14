const express=require('express');
const router=express.Router();
require('dotenv').config();
const routes=require('../models/routes');



router.get("/adminlogin",(req,res)=>{
    res.render("adminlogin")

})
router.post("/adminlogin",(req,res )=>{
    const { email, password } = req.body;
    if (email === "" || password === "") {
        return res.send("Please enter all the fields");  // Return after sending the response
      }
      else if(email===process.env.email  && password===process.env.password){
    // console.log("data saved")   
    res.redirect("/admin/adminlogin/adminhome")}
    else{
     
       return res.send("Invalid Credentials")
    }
})

router.get("/adminlogin/adminhome",(req,res)=>{
    res.render("adminhome")
})

router.post("/add-route",(req,res )=>{
    const { route_name, bus_number, departure, source, destination, driver_name, driver_contact, stop_name, arrival_time } = req.body;

  // Create stops array
  const stops = stop_name.map((name, index) => ({
    stop_name: name,
    arrival_time: arrival_time[index],
  }));

  // Create a new route document
  const newRoute = new routes({
    route_name,
    bus_number,
    departure,
    source,
    destination,
    driver_name,
    driver_contact,
    stops,
  });

  // Save the route to the database
  newRoute.save()
    .then(() => {
        res.redirect("/admin/adminlogin/adminhome")
    })
    .catch((err) => {
      console.error('Error adding route:', err);
      res.status(500).send('Internal Server Error');
    });
    // console.log(req.body)   
    
})


module.exports=router;