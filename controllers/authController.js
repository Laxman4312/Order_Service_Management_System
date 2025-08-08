const User = require('../models/User');
const jwt = require('jsonwebtoken');

const authController = {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            
            const isValidPassword = await User.validatePassword(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET || 'fallback_secret',
                { expiresIn: '24h' }
            );
            
            res.json({
                message: 'Login successful',
                token,
                user: { id: user.id, email: user.email }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    async register(req, res) {
        try {
            const { email, password } = req.body;
            
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }
            
            const user = await User.create({ email, password });
            res.status(201).json({ message: 'User created successfully', user });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = authController;