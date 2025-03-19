


const { S3 } = require("aws-sdk");
const uuid = require("uuid").v4;

const s3 = new S3();

// exports.s3Uploadv2 = async (file) => {
//   const id = uuid(); // Generate unique ID
//   const s3ObjectName = `uploads/${id}-${file.originalname}`;
  
//   const params = {
//     Bucket: process.env.S3_BUCKET_NAME,
//     Key: s3ObjectName,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//     Metadata: {
//         'x-amz-meta-original-filename': file.originalname
//       }
//     // ACL: 'public-read'
//   };

//   console.log('S3 Upload Params:', params);

//   try {
//     const result = await s3.upload(params).promise();
//     console.log('S3 Upload Success:', result.Location);

//     return {
//       id,
//       file_name: file.originalname,
//       //url: `${process.env.S3_BUCKET_NAME}/${s3ObjectName}`,
//       url:result.Location,
//       upload_date: new Date().toISOString()
//     };
//   } catch (error) {
//     console.error('S3 Upload Error:', error.message);
//     throw new Error(`S3 upload failed: ${error.message}`);
//   }
// };
exports.s3Uploadv2 = async (file) => {
    const id = uuid(); // Generate unique ID
    const s3ObjectName = `uploads/${id}-${file.originalname}`;
    
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3ObjectName,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        'x-amz-meta-original-filename': file.originalname
      }
      // ACL: 'public-read'
    };
  
    console.log('S3 Upload Params:', params);
  
    try {
      const result = await s3.upload(params).promise();
      console.log('S3 Upload Success:', result.Location);
  
      // Get the object metadata to return complete information
      const objectData = await s3.headObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3ObjectName
      }).promise();
  
      return {
        id,
        file_name: file.originalname,
        url: result.Location,
        upload_date: new Date().toISOString(),
        content_type: file.mimetype,
        storage_class: objectData.StorageClass || 'STANDARD',
        etag: objectData.ETag,
        encryption_type: objectData.ServerSideEncryption || 'None'
      };
    } catch (error) {
      console.error('S3 Upload Error:', error.message);
      throw new Error(`S3 upload failed: ${error.message}`);
    }
  };
exports.s3GetFile = async (id) => {
  const objects = await s3.listObjectsV2({
    Bucket: process.env.S3_BUCKET_NAME,
    Prefix: `uploads/${id}`
  }).promise();

  if (objects.Contents.length === 0) {
    throw new Error(`File with id ${id} not found`);
  }

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: objects.Contents[0].Key
  };

//   try {
//     const data = await s3.getObject(params).promise();
//     const metadata = data.Metadata;
//     return {
//       //file_name: objects.Contents[0].Key.split('-').slice(1).join('-'),
//       file_name: metadata['x-amz-meta-original-filename'],
//       id,
//       url: 'https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${objects.Contents[0].Key}',
//       upload_date: objects.Contents[0].LastModified.toISOString()
//     };
try {
    const data = await s3.getObject(params).promise();
    const metadata = data.Metadata;
    return {
      file_name: metadata['x-amz-meta-original-filename'],
      id,
      url: `${process.env.S3_BUCKET_NAME}/${objects.Contents[0].Key}`,
      upload_date: objects.Contents[0].LastModified.toISOString()
    };

  } catch (error) {
    console.error('S3 Get Error:', error.message);
    throw new Error(`S3 get failed: ${error.message}`);
  }
};

exports.s3DeleteFile = async (id) => {
  const objects = await s3.listObjectsV2({
    Bucket: process.env.S3_BUCKET_NAME,
    Prefix: `uploads/${id}`
  }).promise();

  if (objects.Contents.length === 0) {
    throw new Error(`File with id ${id} not found`);
  }

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: objects.Contents[0].Key
  };

  try {
    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error('S3 Delete Error:', error.message);
    throw new Error(`S3 delete failed: ${error.message}`);
  }
};
