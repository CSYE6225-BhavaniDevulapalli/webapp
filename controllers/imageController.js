


const log = require('../config/logger');
const { health } = require('../controllers/healthController');
const { s3Uploadv2, s3GetFile, s3DeleteFile } = require('../middlewares/s3');
const Image = require('../models/imageModel');
const { sequelize } = require('../config/sequelize');
const { trackApiDuration, trackDbQuery, trackS3Call, incrementMetric } = require('../middlewares/cloudWatch');

/**
 * Upload File - POST /files
 */
exports.uploadFile = async (req, res) => {
    try {
        log.info('Upload request received');
        incrementMetric('post_files.requests');
        
        // Track API Duration
        await trackApiDuration('post_files', async () => {
            const healthCheckResult = await health(req, res, true);
            if (!healthCheckResult || healthCheckResult.statusCode === 503) {
                log.warn('Health check failed. Service unavailable');
                incrementMetric('post_files.failure');
                return res.status(503).send();
            }
            
            const file = req.file;
            if (!file) {
                log.warn('No file uploaded in request');
                incrementMetric('post_files.no_file');
                return res.status(400).json({ message: 'No file uploaded' });
            }

            log.info(`Uploading file: ${file.originalname}, Size: ${file.size} bytes`);
            
            // Track S3 Call Duration
            await trackS3Call('upload', async () => {
                const uploadResult = await s3Uploadv2(file);
                log.info(`File uploaded to S3 with ID: ${uploadResult.id}`);

                // Track Database Query Duration
                await trackDbQuery('save_metadata_post', async () => {
                    await Image.create({
                        id: uploadResult.id, 
                        file_name: uploadResult.file_name,
                        url: uploadResult.url,
                        upload_date: uploadResult.upload_date,
                        content_type: uploadResult.content_type,
                        storage_class: uploadResult.storage_class,
                        etag: uploadResult.etag,
                        encryption_type: uploadResult.encryption_type
                    });
                });

                log.info(`File metadata saved in DB for ID: ${uploadResult.id}`);

                const response = {
                    file_name: uploadResult.file_name,
                    id: uploadResult.id,
                    url: uploadResult.url,
                    upload_date: uploadResult.upload_date
                };

                incrementMetric('post_files.success');
                return res.status(201).json(response);
            });
        });
    } catch (error) {
        log.error(`Upload Error: ${error.message}`, { stack: error.stack });
        incrementMetric('post_files.failure');
        return res.status(400).json({ message: 'Failed to upload file', error: error.message });
    }
};

/**
 * Get File - GET /files/:id
 */
exports.getFile = async (req, res) => {
    try {
        log.info('Get file request received');
        incrementMetric('get_files_id.requests');

        // Track API Duration
        await trackApiDuration('get_files_id', async () => {
            const healthCheckResult = await health(req, res, true);
            if (healthCheckResult.statusCode === 503) {
                log.warn('Health check failed. Service unavailable');
                incrementMetric('get_files_id.failure');
                return res.status(503).send();
            }

            const { id } = req.params;
            if (!id) {
                log.warn('Invalid file ID provided');
                incrementMetric('get_files_id.invalid_id');
                return res.status(400).json({ message: 'Invalid file ID' });
            }

            log.info(`Fetching file with ID: ${id}`);
            
            // Track S3 Call Duration
            await trackS3Call('retrieve_getfiles', async () => {
                const fileData = await s3GetFile(id);
                log.info(`File retrieved successfully: ${fileData.file_name}`);

                const response = {
                    file_name: fileData.file_name,
                    id: fileData.id,
                    url: fileData.url,
                    upload_date: fileData.upload_date
                };

                incrementMetric('get_files_id.success');
                return res.status(200).json(response);
            });
        });
    } catch (error) {
        log.error(`Get File Error: ${error.message}`, { stack: error.stack });
        incrementMetric('get_files_id.failure');
        return res.status(404).json({ message: 'File not found', error: error.message });
    }
};

/**
 * Delete File - DELETE /files/:id
 */
exports.deleteFile = async (req, res) => {
    try {
        log.info('Delete file request received');
        incrementMetric('Delete_files_id.requests');

        // Track API Duration
        await trackApiDuration('delete_files_id', async () => {
            const healthCheckResult = await health(req, res, true);
            if (healthCheckResult.statusCode === 503) {
                log.warn('Health check failed. Service unavailable');
                incrementMetric('delete_files_id.failure');
                return res.status(503).send();
            }

            const { id } = req.params;
            if (!id) {
                log.warn('Invalid file ID provided');
                incrementMetric('delete_files_id.invalid_id');
                return res.status(400).json({ message: 'Invalid file ID' });
            }

            log.info(`Deleting file with ID: ${id}`);
            
            // Track S3 Call Duration
            await trackS3Call('delete_files', async () => {
                await s3DeleteFile(id);
                log.info(`File deleted from S3: ${id}`);
            });

            // Track Database Query Duration
            await trackDbQuery('delete_metadata', async () => {
                const deletedCount = await Image.destroy({ where: { id: id } });
                if (deletedCount === 0) {
                    log.warn(`No database record found for id: ${id}`);
                    incrementMetric('delete_files_id.not_found');
                } else {
                    log.info(`Successfully deleted database record for id: ${id}`);
                    incrementMetric('delete_files_id.success');
                }
            });

            return res.status(204).send();
        });
    } catch (error) {
        log.error(`Delete Error: ${error.message}`, { stack: error.stack });
        incrementMetric('delete_files_id.failure');
        if (error.message.includes('not found')) {
            return res.status(404).json({ message: 'File not found', error: error.message });
        }
    }
};


