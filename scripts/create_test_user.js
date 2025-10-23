#!/usr/bin/env node
// scripts/create_test_user.js
// Usage: node scripts/create_test_user.js [email] [password]
// Optional env vars: MONGODB_URI, TEST_USER_EMAIL, TEST_USER_PASSWORD

require('dotenv').config();
const db = require('../models/db');
const User = require('../models/User');

const email = (process.argv[2] || process.env.TEST_USER_EMAIL || 'test@example.com').toLowerCase();
const password = process.argv[3] || process.env.TEST_USER_PASSWORD || 'Password123!';

async function main() {
  try {
    await db.connect();

    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`User already exists: ${existing.email}`);
      console.log(`Credentials: ${existing.email} / (password unchanged)`);
      process.exit(0);
    }

    const newUser = new User({ email });
    const registered = await User.register(newUser, password);
    console.log('✅ Test user created:');
    console.log(`   email: ${registered.email}`);
    console.log(`   password: ${password}`);
    process.exit(0);
  } catch (err) {
    console.error('Error creating test user:', err && err.message ? err.message : err);
    process.exit(2);
  }
}

main();
