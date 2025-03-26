
// const log = require('../config/logger');
// const { health } = require('../controllers/healthController');
// const { s3Uploadv2, s3GetFile, s3DeleteFile } = require('../middlewares/s3');
// const Image = require('../models/imageModel');
// const { sequelize } = require('../config/sequelize');

// exports.uploadFile = async (req, res) => {
//   try {
//     log.info('Upload request received');
//     const healthCheckResult = await health(req, res, true);

//     if (!healthCheckResult || healthCheckResult.statusCode === 503) {
//       log.warn('Health check failed. Service unavailable');
//       return res.status(503).send();
//     }
    
//     const file = req.file;
//     if (!file) {
//       log.warn('No file uploaded in request');
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     log.info(`Uploading file: ${file.originalname}, Size: ${file.size} bytes`);
    
//     // Upload to S3
//     const uploadResult = await s3Uploadv2(file);
//     log.info(`File uploaded to S3 with ID: ${uploadResult.id}`);

//     // Save file metadata to the database
//     await Image.create({
//       id: uploadResult.id, 
//       file_name: uploadResult.file_name,
//       url: uploadResult.url,
//       upload_date: uploadResult.upload_date,
//       content_type: uploadResult.content_type,
//       storage_class: uploadResult.storage_class,
//       etag: uploadResult.etag,
//       encryption_type: uploadResult.encryption_type
//     });

//     log.info(`File metadata saved in DB for ID: ${uploadResult.id}`);

//     const response = {
//       file_name: uploadResult.file_name,
//       id: uploadResult.id,
//       url: uploadResult.url,
//       upload_date: uploadResult.upload_date
//     };

//     return res.status(201).json(response);
//   } catch (error) {
//     log.error(`Upload Error: ${error.message}`, { stack: error.stack });
//     return res.status(400).json({ message: 'Failed to upload file', error: error.message });
//   }
// };

// exports.getFile = async (req, res) => {
//   try {
//     log.info('Get file request received');
//     const healthCheckResult = await health(req, res, true);

//     if (healthCheckResult.statusCode === 503) {
//       log.warn('Health check failed. Service unavailable');
//       return res.status(503).send();
//     }
    
//     const { id } = req.params;
//     if (!id) {
//       log.warn('Invalid file ID provided');
//       return res.status(400).json({ message: 'Invalid file ID' });
//     }

//     log.info(`Fetching file with ID: ${id}`);
//     const fileData = await s3GetFile(id);

//     log.info(`File retrieved successfully: ${fileData.file_name}`);
    
//     const response = {
//       file_name: fileData.file_name,
//       id: fileData.id,
//       url: fileData.url,
//       upload_date: fileData.upload_date
//     };

//     return res.status(200).json(response);
//   } catch (error) {
//     log.error(`Get File Error: ${error.message}`, { stack: error.stack });
//     return res.status(404).json({ message: 'File not found', error: error.message });
//   }
// };

// exports.deleteFile = async (req, res) => {
//   try {
//     log.info('Delete file request received');
//     const healthCheckResult = await health(req, res, true);

//     if (healthCheckResult.statusCode === 503) {
//       log.warn('Health check failed. Service unavailable');
//       return res.status(503).send();
//     }
    
//     const { id } = req.params;
//     if (!id) {
//       log.warn('Invalid file ID provided');
//       return res.status(400).json({ message: 'Invalid file ID' });
//     }

//     log.info(`Deleting file with ID: ${id}`);
    
//     // Delete from S3
//     await s3DeleteFile(id);
//     log.info(`File deleted from S3: ${id}`);

//     // Delete from database
//     const deletedCount = await Image.destroy({ where: { id: id } });

//     if (deletedCount === 0) {
//       log.warn(`No database record found for id: ${id}`);
//     } else {
//       log.info(`Successfully deleted database record for id: ${id}`);
//     }

//     return res.status(204).send();
//   } catch (error) {
//     log.error(`Delete Error: ${error.message}`, { stack: error.stack });
//     if (error.message.includes('not found')) {
//       return res.status(404).json({ message: 'File not found', error: error.message });
//     }
//   }
// };


// const log = require('../config/logger');
// const { health } = require('../controllers/healthController');
// const { s3Uploadv2, s3GetFile, s3DeleteFile } = require('../middlewares/s3');
// const Image = require('../models/imageModel');
// const { sequelize } = require('../config/sequelize');
// const statsd = require('../config/statsd');  // Import StatsD client

// exports.uploadFile = async (req, res) => {
//   try {
//     log.info('Upload request received');
//     statsd.increment('file_upload.requests');  // Metric for file upload request

//     const healthCheckResult = await health(req, res, true);

//     if (!healthCheckResult || healthCheckResult.statusCode === 503) {
//       log.warn('Health check failed. Service unavailable');
//       statsd.increment('file_upload.failure'); // Metric for upload failure
//       return res.status(503).send();
//     }
    
//     const file = req.file;
//     if (!file) {
//       log.warn('No file uploaded in request');
//       statsd.increment('file_upload.no_file');  // Metric for no file uploaded
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     log.info(`Uploading file: ${file.originalname}, Size: ${file.size} bytes`);
    
//     // Upload to S3
//     const uploadResult = await s3Uploadv2(file);
//     log.info(`File uploaded to S3 with ID: ${uploadResult.id}`);

//     // Save file metadata to the database
//     await Image.create({
//       id: uploadResult.id, 
//       file_name: uploadResult.file_name,
//       url: uploadResult.url,
//       upload_date: uploadResult.upload_date,
//       content_type: uploadResult.content_type,
//       storage_class: uploadResult.storage_class,
//       etag: uploadResult.etag,
//       encryption_type: uploadResult.encryption_type
//     });

//     log.info(`File metadata saved in DB for ID: ${uploadResult.id}`);

//     const response = {
//       file_name: uploadResult.file_name,
//       id: uploadResult.id,
//       url: uploadResult.url,
//       upload_date: uploadResult.upload_date
//     };

//     statsd.increment('file_upload.success');  // Metric for upload success
//     return res.status(201).json(response);
//   } catch (error) {
//     log.error(`Upload Error: ${error.message}`, { stack: error.stack });
//     statsd.increment('file_upload.failure');  // Metric for upload failure
//     return res.status(400).json({ message: 'Failed to upload file', error: error.message });
//   }
// };
// exports.getFile = async (req, res) => {
//   try {
//     log.info('Get file request received');
//     statsd.increment('file_retrieve.requests');  // Metric for file retrieve request

//     const healthCheckResult = await health(req, res, true);

//     if (healthCheckResult.statusCode === 503) {
//       log.warn('Health check failed. Service unavailable');
//       statsd.increment('file_retrieve.failure'); // Metric for failure
//       return res.status(503).send();
//     }
    
//     const { id } = req.params;
//     if (!id) {
//       log.warn('Invalid file ID provided');
//       statsd.increment('file_retrieve.invalid_id'); // Metric for invalid file ID
//       return res.status(400).json({ message: 'Invalid file ID' });
//     }

//     log.info(`Fetching file with ID: ${id}`);
//     const fileData = await s3GetFile(id);

//     log.info(`File retrieved successfully: ${fileData.file_name}`);
    
//     const response = {
//       file_name: fileData.file_name,
//       id: fileData.id,
//       url: fileData.url,
//       upload_date: fileData.upload_date
//     };

//     statsd.increment('file_retrieve.success'); // Metric for success
//     return res.status(200).json(response);
//   } catch (error) {
//     log.error(`Get File Error: ${error.message}`, { stack: error.stack });
//     statsd.increment('file_retrieve.failure'); // Metric for failure
//     return res.status(404).json({ message: 'File not found', error: error.message });
//   }
// };
// exports.deleteFile = async (req, res) => {
//   try {
//     log.info('Delete file request received');
//     statsd.increment('file_delete.requests');  // Metric for file delete request

//     const healthCheckResult = await health(req, res, true);

//     if (healthCheckResult.statusCode === 503) {
//       log.warn('Health check failed. Service unavailable');
//       statsd.increment('file_delete.failure'); // Metric for failure
//       return res.status(503).send();
//     }
    
//     const { id } = req.params;
//     if (!id) {
//       log.warn('Invalid file ID provided');
//       statsd.increment('file_delete.invalid_id'); // Metric for invalid file ID
//       return res.status(400).json({ message: 'Invalid file ID' });
//     }

//     log.info(`Deleting file with ID: ${id}`);
    
//     // Delete from S3
//     await s3DeleteFile(id);
//     log.info(`File deleted from S3: ${id}`);

//     // Delete from database
//     const deletedCount = await Image.destroy({ where: { id: id } });

//     if (deletedCount === 0) {
//       log.warn(`No database record found for id: ${id}`);
//       statsd.increment('file_delete.not_found'); // Metric for not found
//     } else {
//       log.info(`Successfully deleted database record for id: ${id}`);
//       statsd.increment('file_delete.success'); // Metric for success
//     }

//     return res.status(204).send();
//   } catch (error) {
//     log.error(`Delete Error: ${error.message}`, { stack: error.stack });
//     statsd.increment('file_delete.failure'); // Metric for failure
//     if (error.message.includes('not found')) {
//       return res.status(404).json({ message: 'File not found', error: error.message });
//     }
//   }
// };

const log = require('../config/logger');
const { health } = require('../controllers/healthController');
const { s3Uploadv2, s3GetFile, s3DeleteFile } = require('../middlewares/s3');
const Image = require('../models/imageModel');
const { sequelize } = require('../config/sequelize');
const statsd = require('../config/statsd');
const { trackApiDuration, trackDbQuery, trackS3Call, incrementMetric } = require('../middlewares/cloudWatch');

exports.uploadFile = async (req, res) => {
  try {
    log.info('Upload request received');
    incrementMetric('file_upload.requests');

    const healthCheckResult = await health(req, res, true);
    if (!healthCheckResult || healthCheckResult.statusCode === 503) {
      log.warn('Health check failed. Service unavailable');
      incrementMetric('file_upload.failure');
      return res.status(503).send();
    }
    
    const file = req.file;
    if (!file) {
      log.warn('No file uploaded in request');
      incrementMetric('file_upload.no_file');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    log.info(`Uploading file: ${file.originalname}, Size: ${file.size} bytes`);
    
    // Upload to S3
    const uploadResult = await trackS3Call('upload', () => s3Uploadv2(file));
    log.info(`File uploaded to S3 with ID: ${uploadResult.id}`);

    // Save file metadata to the database
    await trackDbQuery('save_metadata', () => Image.create({
      id: uploadResult.id, 
      file_name: uploadResult.file_name,
      url: uploadResult.url,
      upload_date: uploadResult.upload_date,
      content_type: uploadResult.content_type,
      storage_class: uploadResult.storage_class,
      etag: uploadResult.etag,
      encryption_type: uploadResult.encryption_type
    }));

    log.info(`File metadata saved in DB for ID: ${uploadResult.id}`);

    const response = {
      file_name: uploadResult.file_name,
      id: uploadResult.id,
      url: uploadResult.url,
      upload_date: uploadResult.upload_date
    };

    incrementMetric('file_upload.success');
    return res.status(201).json(response);
  } catch (error) {
    log.error(`Upload Error: ${error.message}`, { stack: error.stack });
    incrementMetric('file_upload.failure');
    return res.status(400).json({ message: 'Failed to upload file', error: error.message });
  }
};

exports.getFile = async (req, res) => {
  try {
    log.info('Get file request received');
    incrementMetric('file_retrieve.requests');

    const healthCheckResult = await health(req, res, true);
    if (healthCheckResult.statusCode === 503) {
      log.warn('Health check failed. Service unavailable');
      incrementMetric('file_retrieve.failure');
      return res.status(503).send();
    }
    
    const { id } = req.params;
    if (!id) {
      log.warn('Invalid file ID provided');
      incrementMetric('file_retrieve.invalid_id');
      return res.status(400).json({ message: 'Invalid file ID' });
    }

    log.info(`Fetching file with ID: ${id}`);
    const fileData = await trackS3Call('retrieve', () => s3GetFile(id));

    log.info(`File retrieved successfully: ${fileData.file_name}`);
    
    const response = {
      file_name: fileData.file_name,
      id: fileData.id,
      url: fileData.url,
      upload_date: fileData.upload_date
    };

    incrementMetric('file_retrieve.success');
    return res.status(200).json(response);
  } catch (error) {
    log.error(`Get File Error: ${error.message}`, { stack: error.stack });
    incrementMetric('file_retrieve.failure');
    return res.status(404).json({ message: 'File not found', error: error.message });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    log.info('Delete file request received');
    incrementMetric('file_delete.requests');

    const healthCheckResult = await health(req, res, true);
    if (healthCheckResult.statusCode === 503) {
      log.warn('Health check failed. Service unavailable');
      incrementMetric('file_delete.failure');
      return res.status(503).send();
    }
    
    const { id } = req.params;
    if (!id) {
      log.warn('Invalid file ID provided');
      incrementMetric('file_delete.invalid_id');
      return res.status(400).json({ message: 'Invalid file ID' });
    }

    log.info(`Deleting file with ID: ${id}`);
    
    // Delete from S3
    await trackS3Call('delete', () => s3DeleteFile(id));
    log.info(`File deleted from S3: ${id}`);

    // Delete from database
    const deletedCount = await trackDbQuery('delete_metadata', () => Image.destroy({ where: { id: id } }));

    if (deletedCount === 0) {
      log.warn(`No database record found for id: ${id}`);
      incrementMetric('file_delete.not_found');
    } else {
      log.info(`Successfully deleted database record for id: ${id}`);
      incrementMetric('file_delete.success');
    }

    return res.status(204).send();
  } catch (error) {
    log.error(`Delete Error: ${error.message}`, { stack: error.stack });
    incrementMetric('file_delete.failure');
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: 'File not found', error: error.message });
    }
  }
};
