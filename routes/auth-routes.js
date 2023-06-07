const express = require('express');
const passport = require('passport');
const { checkAuthenticated } = require('../helpers/authProtect');
const router = express.Router();

// ^ Google authentication
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/profileInfo',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/auth/google',
  })
);

//Use the req.isAuthenticated() function to check if user is Authenticated
router.get('/profile', checkAuthenticated, (req, res) => {
  console.log('req.user', req.user);
  res.render('profileInfo', { user: req.user });
});

router.post('/logout', (req, res) => {
  req.logOut(function (err) {
    if (err) return next(err);
    res.redirect('/');
  });
});

// ^ Facebook authentication
router.get(
  '/auth/facebook',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

module.exports = {
  routes: router,
};
