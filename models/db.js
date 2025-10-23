// models/db.js
const mongoose = require('mongoose');

// Provide a sensible local default so developers can run the app without
// setting an env var. Production deployments should provide MONGODB_URI.
const DEFAULT_URI = 'mongodb://127.0.0.1:27017/tse4';

// Use environment variable if provided, otherwise fall back to local DB.
const uri = process.env.MONGODB_URI || DEFAULT_URI;

// Connect function (async). Returns the mongoose connect promise so callers
// can await it if they want to.
exports.connect = async function connect() {
    try {
        // Use modern recommended options through mongoose 6+ (these are defaults
        // in newer mongoose versions but passing them here is harmless).
        await mongoose.connect(uri, {
            // these are default in mongoose 6+, kept for clarity
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`✅ MongoDB connected to ${uri}`);
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        // Don't exit the process automatically; let the app decide. In many apps
        // you may want to process.exit(1) here for a hard fail.
    }
};

// Helpful listeners for runtime diagnostics
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err && err.message ? err.message : err);
});

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected.');
});

// Export mongoose for other modules that might want access
exports.mongoose = mongoose;
exports.connection = mongoose.connection;