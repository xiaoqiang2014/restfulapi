/**
 * Created by Michael on 2023/10/03.
 */
const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['guest', 'employee'],
        default: 'guest'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the User model
const User = mongoose.model('users', userSchema);

module.exports = User;