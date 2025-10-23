const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true,
    }
    // passportLocalMongoose handles the password hash and salt
});

UserSchema.plugin(passportLocalMongoose, { 
    usernameField: 'email'
});

module.exports = mongoose.model('User', UserSchema);