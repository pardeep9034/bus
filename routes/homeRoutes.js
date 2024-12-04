const express = require('express');
const router = express.Router();
const routes = require('../models/routes');
const User = require('../models/user');

const preventCache = require('../utils/preventCache');
const wrapAsync = require('../utils/wrapAsync');
const registeredRoute = require('../models/registeredroute');
const {isloggedin}=require('../utils/middelware');
const homeController = require('../controllers/home');

router.get('/',(req,res)=>{
 res.redirect("/app/login/home");
});

router.get("/routes",isloggedin,preventCache, wrapAsync(homeController.route));
router.get("/profile",isloggedin,preventCache,wrapAsync(homeController.profile));
router.get("/routes/register/:id",isloggedin,preventCache,wrapAsync(homeController.registerPage));
router.post("/routes/register/:id",isloggedin, wrapAsync(homeController.register));
router.post("/routes/search",isloggedin,preventCache,wrapAsync(homeController.search));
// router.get("/routes/register/:id/checkout",isloggedin,preventCache,wrapAsync(homeController.checkoutPage));
// app.post('/create-checkout-session', async (req, res) => {
//     const { routeId, stopname, userId, price } = req.body; // Get dynamic data from client
  
//     try {
//       // Create a new Stripe Checkout session
//       const session = await stripe.checkout.sessions.create({
//         payment_method_types: ['card', 'upi'], // Include UPI as a payment option
//         line_items: [
//           {
//             price_data: {
//               currency: 'usd', // Currency in INR
//               product_data: {
//                 name: 'Bus Pass', // You can customize this
//               },
//               unit_amount: price * 1000, // Price in paise (multiply by 100 to convert to rupees)
//             },
//             quantity: 1,
//           },
//         ],
//         mode: 'payment',
//         success_url: `${req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`, // Redirect to success page
//         cancel_url: `${req.headers.origin}/payment-cancel`,
//       });
  
//       res.json({ id: session.id }); // Return the session ID to the client
//     } catch (err) {
//       res.status(500).send({ error: err.message });
//     }
//   });
//   app.get('/payment-success', async (req, res) => {
//     const { session_id } = req.query;
  
//     try {
//       // Fetch session from Stripe using session_id
//       const session = await stripe.checkout.sessions.retrieve(session_id);
  
//       if (session.payment_status === 'paid') {
//         // Fetch or pass the necessary data to update the user (e.g., via query params or session)
//         const routeId = req.query.routeId;
//         const stopname = req.query.stopname;
//         const userId = req.query.userId;
  
//         // Update the user record in the database (MongoDB example)
//         await RegisterRouteModel.updateOne(
//           { userId: userId },
//           { $set: { routeId: routeId, stopname: stopname, paymentStatus: 'Paid' } }
//         );
  
//         // Redirect or render success page
//         res.render('payment-success', { message: 'Payment successful, your bus route is registered!' });
//       }
//     } catch (err) {
//       res.status(500).send('Payment verification failed');
//     }
//   });
  
  
module.exports = router;