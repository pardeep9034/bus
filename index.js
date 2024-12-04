const express=require('express');
const app=express();
const path=require('path');
const ejsmate=require('ejs-mate');
const mongoose=require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');
const User = require('./models/user');
const cookieParser = require('cookie-parser');
require('dotenv').config();



const sessionOptions = {
  secret: process.env.SECRET || "thisisnotasecret", // Better to use an env variable for production
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  },
};
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user
  next();
});

// Passport Configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.json());
app.use(cookieParser());
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'/public')));
app.set('views',path.join(__dirname,'/views'));
app.engine('ejs',ejsmate);

// Connect to MongoDB
main()
.then((res)=>{  
    console.log('Connected to MongoDB');
})
.catch((err)=>{
    console.log(err);
});



async function main(){
    await mongoose.connect(process.env.MONGO_URI);}
app.get('/',(req,res)=>{
 

    res.render('./landingpage/index');
});

app.use("/signup",require('./routes/signupRoutes'));
app.use("/app",require('./routes/loginRoutes'));
app.use("/home",require('./routes/homeRoutes'));
app.use("/admin",require('./routes/adminRoutes'));

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(message);
});

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});

