
const express = require('express');
const httpStatus = require('http-status');
const { health } = require('../controllers/healthController');

const router = express.Router();

// Middleware to block HEAD requests explicitly
router.use('/healthz', (req, res, next) => {
  if (req.method === 'HEAD') {
    console.log('HEAD method is not allowed');
    return res.status(405).send();
  }
  next();
});

// Explicitly handling GET requests for /healthz
router.get('/healthz', health);

// Disallowing all other methods (POST, PUT, DELETE, etc.)
router.all('/healthz', (req, res) => {
  console.log(`Unsupported method: ${req.method}`);
  res.status(405).send();
});

module.exports = router;
