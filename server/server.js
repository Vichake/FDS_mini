const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
// const playlistRoutes = require('./routes/playlistRoutes');


// Routes
const authRoutes = require('./routes/authRoutes');  // Assuming this is your auth route 
const songRoutes = require('./routes/songRoutes');
const likeRoutes = require('./routes/likeRoutes'); // Assuming this is your like route



const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve song files from /uploads folder

// Routes

app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/likes', likeRoutes);



// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });
})
.catch(err => console.error('❌ MongoDB connection error:', err));
