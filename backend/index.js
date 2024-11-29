const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// Import routes
const userRoutes = require('./routes/userRoutes');
const couponRoutes = require('./routes/couponRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Use routes
app.use('/api', userRoutes);
app.use('/api', couponRoutes);
app.use('/api', transactionRoutes);
app.use('/api', categoryRoutes);

// Root route
app.post('/', (req, res) => {
    res.send(req.body);
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Connected to MongoDB KampusPay_Test');
        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    })
    .catch((err) => {
        console.log('Connection failed:', err.message);
    });
