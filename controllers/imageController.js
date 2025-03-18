
const { s3Uploadv2, s3GetFile, s3DeleteFile } = require('../middlewares/s3');
const Image = require('../models/imageModel');
exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('File Details:', file);

    // Upload to S3
    const uploadResult = await s3Uploadv2(file);

     // Save file metadata to the database
     const newImage = await Image.create({
        file_name: uploadResult.file_name,
        url: uploadResult.url,
        upload_date: uploadResult.upload_date,
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
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Invalid file ID' });
    }

    await s3DeleteFile(id);

     // Now, delete the metadata from the database
     await Image.destroy({
        where: { id }  // Assuming 'id' is the primary key
      });

    return res.status(204).send(); // 204 = No Content
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: 'File not found', error: error.message });
    }

    console.error("Delete Error:", error.message);
    return res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
};
