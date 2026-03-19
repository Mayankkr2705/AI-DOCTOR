const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

dotenv.config();

const authRoutes = require('./routes/auth.routes');
const chatbotRoutes = require('./routes/chatbot.routes');
const reportRoutes = require('./routes/report.routes');
const newsRoutes = require('./routes/news.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medical-ai-chatbot')
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/news', newsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Medical AI Chatbot API is running' });
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: 'File upload error',
      message: err.message
    });
  }

  if (err?.message?.includes('Unsupported file type')) {
    return res.status(400).json({
      error: 'Invalid file type',
      message: err.message
    });
  }

  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
