

// module.exports = router;
const express = require('express');
const multer = require('multer');
const { uploadFile, getFile, deleteFile } = require('../controllers/imageController');

const router = express.Router();

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1000000000, files: 2 },
});

//  POST - Upload File
router.post('/files', upload.single('file'), uploadFile);

//  GET - Get File by ID
router.get('/files/:id', getFile);

//  DELETE - Delete File by ID
router.delete('/files/:id', deleteFile);

module.exports = router;

