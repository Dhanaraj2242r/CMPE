require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const db = require('../models/db');

// Connect to MongoDB
db.connect();

const users = [
    // Original .edu users
    {
        email: '23eg106a14@anurag.edu',
        password: 'password123'
    },
    {
        email: '23eg106a10@anurag.edu',
        password: 'password123'
    },
    {
        email: '23eg106a62@anurag.edu',
        password: 'password123'
    },
    // New .edu.in users
    {
        email: '23eg106a14@anurag.edu.in',
        password: 'password123'
    },
    {
        email: '23eg106a10@anurag.edu.in',
        password: 'password123'
    },
    {
        email: '23eg106a62@anurag.edu.in',
        password: 'password123'
    }
];

async function createUsers() {
    try {
        for (const userData of users) {
            // Check if user already exists
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                console.log(`User ${userData.email} already exists`);
                continue;
            }

            // Create new user
            const user = new User({ email: userData.email });
            await User.register(user, userData.password);
            console.log(`Created user: ${userData.email}`);
        }
        console.log('All users created successfully');
    } catch (error) {
        console.error('Error creating users:', error);
    } finally {
        mongoose.connection.close();
    }
}

createUsers();