// const express = require('express');
// const httpStatus = require('http-status');
// const { health } = require('../controllers/healthController');
// const { uploadFile, getFileMetadata, deleteFile } = require('../controllers/imageController');
// const multer = require('multer');  // Ensure multer is installed for file handling
// const upload = multer({ dest: 'uploads/' });
 
// const router = express.Router();
 
// // Middleware to block HEAD requests explicitly
// router.use('/healthz', (req, res, next) => {
//   if (req.method === 'HEAD') {
//     console.log('HEAD method is not allowed');
//     return res.status(405).send();
//   }
//   next();
// });
 
// // Explicitly handling GET requests for /healthz
// router.get('/healthz', (req, res) => health(req, res, false));
 
 
 
// // Disallowing all other methods (POST, PUT, DELETE, etc.)
// router.all('/healthz', (req, res) => {
//   console.log(`Unsupported method: ${req.method}`);
//   res.status(405).send();
// });
 
 
// module.exports = router;


const express = require('express');
const httpStatus = require('http-status');
const { health } = require('../controllers/healthController');
const { uploadFile, getFileMetadata, deleteFile } = require('../controllers/imageController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const log = require('../config/logger'); 

const router = express.Router();

// Middleware to block HEAD requests explicitly
router.use('/healthz', (req, res, next) => {
  if (req.method === 'HEAD') {
    log.warn('HEAD method is not allowed for /healthz');
    return res.status(405).send();
  }
  next();
});

// Explicitly handling GET requests for /healthz
router.get('/healthz', (req, res) => {
  log.info('Health check received');
  health(req, res, false);
});

// Disallowing all other methods (POST, PUT, DELETE, etc.)
router.all('/healthz', (req, res) => {
  log.warn(`Unsupported method: ${req.method} for /healthz`);
  res.status(405).send();
});

module.exports = router;
