const express = require("express");
const uploadImg = require("../middleware/multer");
const auth = require("../middleware/auth");
const router = express.Router();
const cloudinary = require("../config/cloudinary");
const UserModel = require("../model/UserModel");
const { sendResponse } = require("../helper/helper");
const getDataUrl = require("../buffergenerator");

router.post("/cloud", auth, uploadImg.single("image"), async (req, res) => {
    try {
        const file = req.file
        const userId = req.userId

        console.log("USER ID:", userId);
        if (!file) {
            return res.status(400).send(sendResponse(false, null, "No file uploaded"))
        }


        const fileBuffer = getDataUrl(file)
        const cloud = await cloudinary.uploader.upload(fileBuffer.content)

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                profileImage: {
                    url: cloud.secure_url,
                    id: cloud.public_id,
                },
            }, { new: true }
        );
        console.log("UPDATED USER:", updatedUser);

        res.send(sendResponse(true, cloud.secure_url, "file successfully uploaded", null))
    } catch (error) {
        return res.status(400).send(sendResponse(false, null, "file not uploaded", error.message))
    }
})
module.exports = router