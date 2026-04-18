const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    console.log("COOKIE:", req.cookies);
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Not logged in" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("DECODED:", decoded);
        req.userId = decoded._id;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = auth;  