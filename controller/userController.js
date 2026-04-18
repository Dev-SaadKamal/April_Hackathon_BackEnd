const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../model/UserModel');
const { sendResponse } = require('../helper/helper');
const { get } = require('mongoose');
const auth = require('../middleware/auth');



const UserController = {
    signup: async (req, res) => {
        const { name, email, password } = req.body;
        try {
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return res.status(400).send(sendResponse(400, null, 'User already exists'));
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new UserModel({ name, email, password: hashedPassword });
            await newUser.save();
            // token generated for the user
            const token = jwt.sign({
                _id: newUser._id
            },
                process.env.JWT_SECRET, {
                expiresIn: "24h"
            });

            if (!token) {
                return res.status(500).send(sendResponse(500, null, 'Failed to generate token'));
            }
            return res.status(201)
                .cookie('token', token, {
                    httpOnly: true,
                })
                .send(sendResponse(201, null, 'User created successfully'));
        } catch (error) {
            console.error('Error during signup:', error);
            return res.status(500).send(sendResponse(500, null, 'Internal server error', error.message));
        }
    },
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(400).send(sendResponse(400, null, 'Invalid email or password'));
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).send(sendResponse(400, null, 'Invalid email or password'));
            }
            const token = jwt.sign(
                { _id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "24h" }
            );


            return res.status(200)
                .cookie('token', token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 24 * 60 * 60 * 1000
                })
                .send(sendResponse(200, null, 'Login successful'));
        } catch (error) {
            console.error('Error during login:', error);
            return res.status(500).send(sendResponse(500, null, 'Internal server error', error.message));
        }
    },
    getUser: (req, res) => {
        res.json({ user: req.user });
    },
    logout: async (req, res) => {
        return res
            .status(200)
            .clearCookie("token", {
                httpOnly: true
            })
            .send(sendResponse(true, null, "Logout Successfully"))
    }

};

module.exports = UserController;    