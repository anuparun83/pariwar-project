const express = require('express');
const passport = require('passport');
require('../config/passport')(passport);
const route = express.Router();
const authController = require('../controller/auth');
const isLoginAuth = require('../middleware/isLoginAuth')
route.get('/auth/google', passport.authenticate('google', { scope: ['profile','email'] }))


route.get("/auth/google/pariwar", 
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    req.session.isLoggedIn = true;
    
    res.redirect("/log");
});

route.get('/logout', (req, res) => {
   req.logout()
    req.session.destroy()
  res.redirect('/')
})
route.get('/login',isLoginAuth,authController.getLogin);
route.get('/signup',isLoginAuth,authController.getSignup);
route.get('/forgetPassword',authController.getForgetPage);

route.post('/sign-up',authController.postSingnup);
route.post('/login',authController.postLogin);
route.post('/logout',authController.postLogout);
route.post('/forgetPassword',authController.postForgetPass);


module.exports = route;