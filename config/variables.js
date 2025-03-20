

// require('dotenv').config();
// module.exports = {
//   port: process.env.PORT ,
//   env: process.env.NODE_ENV || 'development',
//   sqlUri: process.env.SQL_URI,
//   database: process.env.DB_NAME,
  
// };

require('dotenv').config();

const sqlUri = `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/`;

module.exports = {
  port: process.env.PORT,
  env: process.env.NODE_ENV || 'development',
  sqlUri,
  database: process.env.DB_NAME,

   // AWS S3 Configuration
   awsRegion: process.env.AWS_REGION || 'us-east-1',
   s3BucketName: process.env.S3_BUCKET_NAME || '',
   ec2ip:process.env.EC2_PUBLIC_IP
};
