
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;



const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
      return res.redirect("/app/login");
    }
  
    try {
      const decoded = jwt.verify(token, secret);
      req.userId = decoded.userId;
      req.userEmail = decoded.userEmail;
      req.routeId = decoded.routeId;
      next();
    } catch (err) {
      return res.redirect("/app/login");
    }
  };
  module.exports = verifyToken;