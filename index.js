require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require("dns");
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const signupRoute = require('./routes/signuproute');
const loginRoute = require('./routes/loginroute');
const uploadRoute = require('./routes/uploadroute');


dns.setServers(["1.1.1.1", "8.8.8.8"]);

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
const allowedOrigins = [
    "http://localhost:5173",
    "https://aprilfinalhackathon.netlify.app"
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            } else {
                return callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true
    })
);

app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.use('/signup', signupRoute);
app.use('/login', loginRoute);
app.use('/upload', uploadRoute);
app.use('/', (req, res) => {
    res.send('Welcome to the API');
});
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
});
