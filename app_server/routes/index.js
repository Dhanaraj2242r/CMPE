// app_server/routes/index.js
var express = require('express');
var router = express.Router();
const Item = require('../../models/item');

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // Redirect unauthenticated users to login page
    res.redirect('/auth/login'); 
}

/* GET home page. */
router.get('/', function(req, res, next) {
  // CORRECT: Passes req.user
  res.render('home', { title: 'Home', user: req.user });
});

/* GET browse page. REQUIRES LOGIN */
router.get('/browse', isLoggedIn, async function(req, res, next) {
  try {
    const searchQuery = req.query.search;
    
    // Build the search query
    let query = {};
    if (searchQuery) {
      // Case-insensitive search on name and description
      query = {
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } }
        ]
      };
    }

    // Load items from the database, newest first, and populate seller email
    const items = await Item.find(query)
      .populate('seller', 'email')
      .sort({ datePosted: -1 })
      .lean();

    res.render('browse', { 
      title: 'Browse Listings', 
      user: req.user, 
      items,
      searchQuery // Pass the search query back to the template
    });
  } catch (err) {
    console.error('Error loading items for browse:', err);
    req.flash('error', 'Could not load listings right now.');
    res.render('browse', { 
      title: 'Browse Listings', 
      user: req.user, 
      items: [],
      searchQuery: req.query.search
    });
  }
});

/* GET upload page. REQUIRES LOGIN */
router.get('/upload', isLoggedIn, function(req, res, next) {
  // CORRECT: Passes req.user
  res.render('upload', { title: 'Upload Item', user: req.user });
});

// Handle item uploads (requires login)
router.post('/upload', isLoggedIn, async function(req, res, next) {
  try {
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
      // Render the upload page with entered values and an error message
      return res.render('upload', { title: 'Upload Item', user: req.user, name, description, price, messages: { error: ['All fields are required.'] } });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.render('upload', { title: 'Upload Item', user: req.user, name, description, price, messages: { error: ['Price must be a non-negative number.'] } });
    }

    const item = new Item({
      name,
      description,
      price: parsedPrice,
      seller: req.user._id
    });

  await item.save();
  // Redirect after successful POST (Post/Redirect/Get)
  req.flash('success', 'Item posted successfully.');
  res.redirect('/browse');
  } catch (err) {
    console.error('Upload error:', err && err.message ? err.message : err);
    if (err && err.stack) console.error(err.stack);
    req.flash('error', 'An error occurred while posting the item. Please try again.');
    res.redirect('/upload');
  }
});

/* DELETE item. REQUIRES LOGIN */
router.post('/delete-item/:id', isLoggedIn, async function(req, res, next) {
  try {
    const item = await Item.findById(req.params.id).populate('seller');
    
    if (!item) {
      req.flash('error', 'Item not found.');
      return res.redirect('/browse');
    }

    // Check if the current user is the seller
    if (item.seller._id.toString() !== req.user._id.toString()) {
      req.flash('error', 'You can only delete your own items.');
      return res.redirect('/browse');
    }

    await Item.findByIdAndDelete(req.params.id);
    req.flash('success', 'Item deleted successfully.');
    res.redirect('/browse');
  } catch (err) {
    console.error('Delete error:', err);
    req.flash('error', 'An error occurred while deleting the item.');
    res.redirect('/browse');
  }
});

/* GET contact page. (No login required) */
router.get('/contact', function(req, res, next) {
  // CORRECT: Passes req.user
  res.render('contact', { title: 'Contact Us', user: req.user });
});

module.exports = router;