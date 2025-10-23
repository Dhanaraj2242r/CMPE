// app_server/routes/auth.js
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../../models/user');

// --- Register Routes ---
router.get('/register', function(req, res) {
    // CORRECT: Passes req.user
    res.render('register', { title: 'Register', user: req.user }); 
});

// Handling user registration
router.post('/register', function(req, res, next) {
    User.register(new User({ email: req.body.email }), req.body.password, function(err, user) {
        if (err) {
            console.error('Registration error:', err);
            // CORRECT: Passes req.user even on error
            return res.render('register', { user: req.user, title: 'Register', error: err.message });
        }
        
        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

// --- Login Routes ---
router.get('/login', function(req, res) {
    // CORRECT: Passes req.user
    res.render('login', { title: 'Login', user: req.user });
});

// Handling user login
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/login',
    failureFlash: true
}), function(req, res) {
    res.redirect('/');
});

// --- Logout Route ---
router.get('/logout', function(req, res) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;