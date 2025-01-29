

require('dotenv').config();
module.exports = {
  port: process.env.PORT ,
  env: process.env.NODE_ENV || 'development',
  sqlUri: process.env.SQL_URI,
  database: process.env.DATABASE,
  
};