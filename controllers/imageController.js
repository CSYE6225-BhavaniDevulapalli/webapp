
 
const { health } = require('../controllers/healthController');
const { s3Uploadv2, s3GetFile, s3DeleteFile } = require('../middlewares/s3');
const Image = require('../models/imageModel');
const { sequelize } = require('../config/sequelize');

 
exports.uploadFile = async (req, res) => {
  try {
    const healthCheckResult = await health(req, res, true);

    if (!healthCheckResult || healthCheckResult.statusCode === 503) {
      return res.status(503).send(); // Return service unavailable if health check fails
    }
    
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
 
    console.log('File Details:', file);
 
   
 
    // Upload to S3
    const uploadResult = await s3Uploadv2(file);
 
    // Save file metadata to the database
    await Image.create({
      id: uploadResult.id, // Use the same ID as in S3
      file_name: uploadResult.file_name,
      url: uploadResult.url,
      upload_date: uploadResult.upload_date,
      content_type: uploadResult.content_type,
      storage_class: uploadResult.storage_class,
      etag: uploadResult.etag,
      encryption_type: uploadResult.encryption_type
    });
 
    const response = {
      file_name: uploadResult.file_name,
      id: uploadResult.id,
      url: uploadResult.url,
      upload_date: uploadResult.upload_date
    };
 
    return res.status(201).json(response);
  } catch (error) {
    console.error("Upload Error:", error.message);
    return res.status(400).json({ message: 'Failed to upload file', error: error.message });
  }
};
 
exports.getFile = async (req, res) => {
  try {
    const healthCheckResult = await health(req, res, true);
 
    if (healthCheckResult.statusCode === 503) {
      return res.status(503).send()
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Invalid file ID' });
    }
 
   
 
    const fileData = await s3GetFile(id);
 
    const response = {
      file_name: fileData.file_name,
      id: fileData.id,
      url: fileData.url,
      upload_date: fileData.upload_date
    };
 
    return res.status(200).json(response);
  } catch (error) {
    console.error("Get File Error:", error.message);
    return res.status(404).json({ message: 'File not found', error: error.message });
  }
};
exports.deleteFile = async (req, res) => {
  try {
    const healthCheckResult = await health(req, res, true);
 
    if (healthCheckResult.statusCode === 503) {
      return res.status(503).send()
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Invalid file ID' });
    }
 
   
 
    // Delete from S3
    await s3DeleteFile(id);
 
    // Delete from database
    const deletedCount = await Image.destroy({
      where: { id: id }
    });
 
    if (deletedCount === 0) {
      console.log(`No database record found for id: ${id}`);
    } else {
      console.log(`Successfully deleted database record for id: ${id}`);
    }
 
    return res.status(204).send(); // 204 = No Content
  } catch (error) {
    console.error("Delete Error:", error.message);
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: 'File not found', error: error.message });
    }
  }
};
 