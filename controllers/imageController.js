
// const { s3Uploadv2, s3GetFile, s3DeleteFile } = require('../middlewares/s3');
// const Image = require('../models/imageModel');



// exports.uploadFile = async (req, res) => {
//     try {
//       const file = req.file;
//       if (!file) {
//         return res.status(400).json({ message: 'No file uploaded' });
//       }
  
//       console.log('File Details:', file);
  
//       // Upload to S3
//       const uploadResult = await s3Uploadv2(file);
      
//       // Save file metadata to the database - now using the ID from S3 upload
//       const newImage = await Image.create({
//         id: uploadResult.id, // Use the same ID as in S3
//         file_name: uploadResult.file_name,
//         url: uploadResult.url,
//         upload_date: uploadResult.upload_date,
//         content_type: uploadResult.content_type,
//         storage_class: uploadResult.storage_class,
//         etag: uploadResult.etag,
//         encryption_type: uploadResult.encryption_type
//       });
  
//       const response = {
//         file_name: uploadResult.file_name,
//         id: uploadResult.id,
//         url: uploadResult.url,
//         upload_date: uploadResult.upload_date
//       };
  
//       return res.status(201).json(response);
//     } catch (error) {
//       console.error("Upload Error:", error.message);
//       return res.status(400).json({ message: 'Failed to upload file', error: error.message });
//     }
//   };
// exports.getFile = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id) {
//       return res.status(400).json({ message: 'Invalid file ID' });
//     }

//     const fileData = await s3GetFile(id);

//     const response = {
//       file_name: fileData.file_name,
//       id: fileData.id,
//       url: fileData.url,
//       upload_date: fileData.upload_date
//     };

//     return res.status(200).json(response);
//   } catch (error) {
//     console.error("Get File Error:", error.message);
//     return res.status(404).json({ message: 'File not found', error: error.message });
//   }
// };

// exports.deleteFile = async (req, res) => {
//     try {
//       const { id } = req.params;
  
//       if (!id) {
//         return res.status(400).json({ message: 'Invalid file ID' });
//       }
  
//       // Delete from S3
//       await s3DeleteFile(id);
      
//       // Delete from database
//       const deletedCount = await Image.destroy({
//         where: { id: id }
//       });
      
//       if (deletedCount === 0) {
//         console.log(`No database record found for id: ${id}`);
//       } else {
//         console.log(`Successfully deleted database record for id: ${id}`);
//       }
  
//       return res.status(204).send(); // 204 = No Content
//     } catch (error) {
//       if (error.message.includes('not found')) {
//         return res.status(404).json({ message: 'File not found', error: error.message });
//       }
  
//       console.error("Delete Error:", error.message);
//       return res.status(401).json({ message: 'Unauthorized', error: error.message });
//     }
//   };





const { s3Uploadv2, s3GetFile, s3DeleteFile } = require('../middlewares/s3');
const Image = require('../models/imageModel');
const { sequelize } = require('../config/sequelize');

exports.uploadFile = async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      console.log('File Details:', file);
  
      // Check database connection first, similar to health endpoint
      try {
        await sequelize.authenticate();
      } catch (dbError) {
        console.error('Database connection failed:', dbError.message);
        return res.status(503);
      }
  
      // Upload to S3
      const uploadResult = await s3Uploadv2(file);
      
      // Save file metadata to the database - now using the ID from S3 upload
      try {
        const newImage = await Image.create({
          id: uploadResult.id, // Use the same ID as in S3
          file_name: uploadResult.file_name,
          url: uploadResult.url,
          upload_date: uploadResult.upload_date,
          content_type: uploadResult.content_type,
          storage_class: uploadResult.storage_class,
          etag: uploadResult.etag,
          encryption_type: uploadResult.encryption_type
        });
      } catch (dbError) {
        console.error('Database operation failed:', dbError.message);
        return res.status(503).json({ message: 'Service Unavailable - Database Operation Failed' });
      }
  
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

    // Check database connection before proceeding
    try {
      await sequelize.authenticate();
    } catch (dbError) {
      console.error('Database connection failed:', dbError.message);
      return res.status(503);
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

    // Check database connection before proceeding
    try {
      await sequelize.authenticate();
    } catch (dbError) {
      console.error('Database connection failed:', dbError.message);
      return res.status(503);
    }

    // Delete from S3
    await s3DeleteFile(id);
    
    // Delete from database
    try {
      const deletedCount = await Image.destroy({
        where: { id: id }
      });
      
      if (deletedCount === 0) {
        console.log(`No database record found for id: ${id}`);
      } else {
        console.log(`Successfully deleted database record for id: ${id}`);
      }
    } catch (dbError) {
      console.error('Database operation failed:', dbError.message);
      return res.status(503);
    }

    return res.status(204).send(); // 204 = No Content
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: 'File not found', error: error.message });
    }

    console.error("Delete Error:", error.message);
    return res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
};