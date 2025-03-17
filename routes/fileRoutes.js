const express = require('express');
const { uploadFile, getFileMetadata, deleteFile } = require('../controllers/fileController');

const router = express.Router();

router.post('/files', uploadFile); // Upload a file
router.get('/files/:id', getFileMetadata); // Get file metadata
router.delete('/files/:id', deleteFile); // Delete a file

module.exports = router;
