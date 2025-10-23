// models/Item.js
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    // Reference the User model to link the item to its seller
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    datePosted: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', ItemSchema);