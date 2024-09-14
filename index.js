const express=require('express');
const app=express();
const path=require('path');
const ejsmate=require('ejs-mate');
const mongoose=require('mongoose');
const registeredRoute=require('./models/registeredroute');
const routes=require('./models/routes');
const User=require('./models/signup');
const verifyToken = require('./utils/verifyToken');
const preventCache = require('./utils/preventCache');
const cookieParser = require('cookie-parser');
require('dotenv').config();




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
    // res.send('Hello World');
    res.render('index');
});

app.use("/signup",require('./routes/signup'));
app.use("/app",require('./routes/login'));
app.use("/home",require('./routes/home'));
app.use("/admin",require('./routes/admin'));

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});

