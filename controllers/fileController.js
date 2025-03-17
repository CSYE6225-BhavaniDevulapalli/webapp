const multer = require('multer');
const File = require('../models/file');
const { uploadFileToS3, deleteFileFromS3 } = require('../middlewares/s3');

const storage = multer.memoryStorage();
const upload = multer({ storage }).single('file');

const uploadFile = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: 'File upload failed' });
            }

            const file = req.file;
            if (!file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            // Upload to S3
            const s3Path = await uploadFileToS3(file);

            // Save metadata to DB
            const newFile = await File.create({
                fileName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                s3Path
            });

            return res.status(201).json(newFile);
        });
    } catch (error) {
        res.status(500).json({ message: `Error uploading file: ${error.message}` });
    }
};

const getFileMetadata = async (req, res) => {
    try {
        const { id } = req.params;
        const file = await File.findByPk(id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        return res.status(200).json({ s3Path: file.s3Path });
    } catch (error) {
        res.status(500).json({ message: `Error fetching file: ${error.message}` });
    }
};

const deleteFile = async (req, res) => {
    try {
        const { id } = req.params;
        const file = await File.findByPk(id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Delete from S3
        await deleteFileFromS3(file.fileName);

        // Delete metadata from DB
        await file.destroy();

        return res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: `Error deleting file: ${error.message}` });
    }
};

module.exports = { uploadFile, getFileMetadata, deleteFile };
