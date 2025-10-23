// Load environment variables from .env file (Requires the 'dotenv' package)
//
 require('dotenv').config(); 

// --- MODULE IMPORTS ---
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Authentication Modules
const session = require('express-session'); // Required for passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; 
const flash = require('connect-flash');

// --- DATABASE AND MODEL IMPORTS ---
// Connect to MongoDB (Requires 'models/db.js' to be present)
const db = require('./models/db'); 
db.connect(); // This function call initiates the MongoDB connection

// Import the User model for Passport configuration (models/user.js)
const User = require('./models/user'); 

// --- ROUTER IMPORTS ---
const indexRouter = require('./app_server/routes/index');
const authRouter = require('./app_server/routes/auth'); // Router for /auth/login, /auth/register

// --- APPLICATION SETUP ---
const app = express();
const port = process.env.PORT || 3000;

// view engine setup (Jade/Pug)
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

// --- MIDDLEWARE CONFIGURATION ---
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public'))); 

// --- PASSPORT & SESSION CONFIGURATION ---

// Set up the Express Session middleware
app.use(session({
  secret: 'a secret that should be complex', // *CHANGE THIS TO A UNIQUE SECRET*
  resave: false, 
  saveUninitialized: false, 
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// Flash messages (used by Passport when failureFlash: true is configured)
app.use(flash());

// Initialize Passport and session support
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy Setup:
// The User model provides createStrategy, serialize, and deserialize methods
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Middleware to make the user object available in Jade templates (for conditional rendering)
// Make the user and flash messages available in all templates
app.use((req, res, next) => {
  res.locals.user = req.user;
  // `req.flash()` returns an object shaped like { error: [...], success: [...], info: [...] }
  res.locals.messages = req.flash();
  next();
});

// --- ROUTE HANDLERS ---
app.use('/', indexRouter);
app.use('/auth', authRouter); // All authentication routes start with /auth

// --- ERROR HANDLERS ---

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{title:'Error'});
});

// --- SERVER STARTUP ---

// Standard block to listen on the configured port
if (module.parent === null) {
  app.listen(port, () => {
    console.log(`\n========================================`);
    console.log(`🚀 Server is running on port ${port}`);
    console.log(`🌐 http://localhost:${port}/`);
    console.log(`========================================\n`);
  });
}

module.exports = app;