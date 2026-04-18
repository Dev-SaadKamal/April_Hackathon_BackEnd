require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require("dns");
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');



const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');


dns.setServers(["1.1.1.1", "8.8.8.8"]);

const PORT = process.env.PORT || 5000;
const app = express();

connectDB().then(() => {
    console.log('Database connection established successfully');
}).catch((err) => {
    res.sendStatus(500).send({ message: 'Failed to connect to the database', error: err.message });
    console.error('Failed to connect to the database:', err);
    process.exit(1); // Exit the process with an error code
});

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
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));



app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/', (req, res) => {
    res.send('Welcome to the API');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


