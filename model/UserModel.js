const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        // 👇 Profile Image (optional)
        profileImage: {
            url: {
                type: String,
                default: ""   // image optional
            },

            id: {
                type: String,
                default: ""   // cloudinary public_id
            }
        }
    },
    {
        timestamps: true
    }
);

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;