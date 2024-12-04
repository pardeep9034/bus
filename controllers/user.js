const User = require("../models/user");
const routes = require("../models/routes");


// loginPage controller
module.exports.loginPage=(req, res) => {
  res.render("./user/login");
}
// loginHome controller
module.exports.loginHome=async (req, res) => {

  const user = await User.findById(req.user._id);
  
  console.log(req.user._id);
  console.log(user);
  let route = null;

  if (user && user.route_id) {
    // Fetch route details if the user is registered for a route
    route = await routes.findById(user.route_id);
    // console.log('Fetched route details:', route);
  } else {
    console.log("User does not have a registered route.");
  }

  // console.log(route);
  res.render("./home/home", {
    user,

    route,
  });

}
// signupPage controller
module.exports.signupPage=(req,res)=>{
    
  res.render('./user/signup');
}
// signup controller
module.exports.signup=async(req,res )=>{
  const { username,name, email, password, roll_no } = req.body;
  const newUser = new User({ username,name, email,  roll_no });
  const registerUser=await User.register(newUser,password);
  req.login(registerUser,(err)=>{
    if(err){
      return next(err);
    }
    req.flash('success','Welcome to the Tranzy');
    res.redirect('/app/login/home');
  });

 
}
// logout controller
module.exports.logout=(req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");

    res.redirect("/");
  });
}
