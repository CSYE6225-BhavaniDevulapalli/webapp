const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../config/s3Client');

const bucketName = process.env.S3_BUCKET_NAME;

const uploadFileToS3 = async (file) => {
    const params = {
        Bucket: bucketName,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype
    };

    try {
        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        return `https://${bucketName}.s3.amazonaws.com/${file.originalname}`;
    } catch (error) {
        throw new Error(`Error uploading file to S3: ${error.message}`);
    }
};

const deleteFileFromS3 = async (fileName) => {
    const params = {
        Bucket: bucketName,
        Key: fileName
    };

    try {
        const command = new DeleteObjectCommand(params);
        await s3Client.send(command);
    } catch (error) {
        throw new Error(`Error deleting file from S3: ${error.message}`);
    }
};

module.exports = { uploadFileToS3, deleteFileFromS3 };
