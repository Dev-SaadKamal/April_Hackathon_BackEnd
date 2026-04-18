const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Create new user with role
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'both' // Default to 'both' if not provided
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        // Return user data (excluding password) and token
        res.status(201).json({
            success: true,
            data: {
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    trustScore: user.trustScore,
                    helpCount: user.helpCount,
                    badges: user.badges,
                    skills: user.skills,
                    interests: user.interests,
                    location: user.location
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        // Return user data and token
        res.json({
            success: true,
            data: {
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    trustScore: user.trustScore,
                    helpCount: user.helpCount,
                    badges: user.badges,
                    skills: user.skills,
                    interests: user.interests,
                    location: user.location
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login };