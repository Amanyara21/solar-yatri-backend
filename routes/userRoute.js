const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const userMiddleware = require('../middelware/userMiddleware');
const router = express.Router();

router.post('/signup', async (req, res) => {
    const {
        name,
        email,
        password,
        userType,
        location,
        householdSize,
        investmentCapacity,
        monthlyElectricityUsage,
        investmentDuration
    } = req.body;

    if (!name || !email || !password || !userType || !location || 
        !householdSize || investmentCapacity === undefined || 
        !monthlyElectricityUsage || !investmentDuration) {
        return res.status(400).json({ message: 'All fields are required.' });
    }


    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const secPassword = await bcryptjs.hash(password, 10);

        const user = new User({
            name,
            email,
            password: secPassword, 
            userType,
            location,
            householdSize,
            investmentCapacity,
            monthlyElectricityUsage,
            investmentDuration,
            investments: [] 
        });
        console.log(user);
        await user.save();

        const token = jwt.sign({ id: user._id, userType: user.userType }, process.env.JWT_TOKEN, { expiresIn: '365d' });
        res.status(201).json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user.', error: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password.' });
        console.log(user);
        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid email or password.' });

        const token = jwt.sign({ id: user._id, userType: user.userType }, process.env.JWT_TOKEN, { expiresIn: '365d' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in user.', error: err.message });
    }
});

router.get('/getuser', userMiddleware, async (req, res) => {
    try {
        console.log(req.user.id);
        const user = await User.findById(req.user.id).select('-password'); 
        if (!user) return res.status(404).json({ message: 'User not found.' });

        res.json({ user, userType: req.userType });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user data.', error: err.message });
    }
});

module.exports = router;
