

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
  database: process.env.DB_NAME
};
