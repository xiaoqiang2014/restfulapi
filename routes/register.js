/**
 * Created by Michael on 2023/10/03.
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Users = require('../models/users');

// Register Guest User
router.post('/guest', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the email already exists in the database
        const existingUser = await Users.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Users({
            name,
            email,
            password: hashedPassword,
            role: 'guest',
            createdAt: new Date()
        });

        const savedUser = await newUser.save();

        res.json(savedUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Register Employee User
router.post('/employee', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the email already exists in the database
        const existingUser = await Users.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Users({
            name,
            email,
            password: hashedPassword,
            role: 'employee',
            createdAt: new Date()
        });

        const savedUser = await newUser.save();

        res.json(savedUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Login Guest User
router.post('/guest/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email, role: 'guest' });

        if (!user) {
            res.status(404).json({ error: 'Invalid email or password' });
        } else {
            // Compare the hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                res.status(404).json({ error: 'Invalid email or password' });
            } else {
                res.json({ message: 'Guest user logged in successfully' });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Login Employee User
router.post('/employee/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email, role: 'employee' });

        if (!user) {
            res.status(404).json({ error: 'Invalid email or password' });
        } else {
            // Compare the hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                res.status(404).json({ error: 'Invalid email or password' });
            } else {
                res.json({ message: 'Employee user logged in successfully' });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;