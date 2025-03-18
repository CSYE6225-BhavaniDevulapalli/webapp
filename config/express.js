
require('dotenv').config();
const express = require('express');
const setHeaders = require('../middlewares/setHeaders');
const fileRoutes = require('../routes/fileRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom Headers
app.use(setHeaders);

// API Routes
app.use('/api', fileRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});



module.exports = app;
