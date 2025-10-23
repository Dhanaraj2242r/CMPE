// models/User.js
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// 1. Define the Schema
const UserSchema = new mongoose.Schema({
    // Only the email is needed here, as the username/hash/salt are handled by passportLocalMongoose
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true // Ensure emails are saved consistently
    },
    // You can add other fields like name, creation date, etc., here
    // Example: fullName: { type: String }
});

// 2. Apply the Passport plugin
// This adds 'username', 'hash', and 'salt' fields, and provides all the required static methods (like createStrategy)
UserSchema.plugin(passportLocalMongoose, { 
    // Tell the plugin to use the 'email' field instead of a default 'username' field
    usernameField: 'email'
});

// 3. Export the model safely
// This is the critical line that avoids the previous OverwriteModelError 
// AND ensures the model is exported correctly.
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);