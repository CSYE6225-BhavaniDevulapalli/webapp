// const { Sequelize } = require('sequelize');
// const { sqlUri, database } = require('./variables');

// const sequelize = new Sequelize(`${sqlUri}${database}`, {
//     logging: false
// });

// exports.sequelize = sequelize;

const { Sequelize } = require('sequelize');
const { sqlUri, database } = require('./variables');

const sequelize = new Sequelize(`${sqlUri}${database}`, {
  logging: false,
  pool: {
    max: 5,             // Maximum number of connections in pool
    min: 0,             // Minimum number of connections in pool
    acquire: 10000,     // Max time (in ms) to try acquiring a connection before throwing an error
    idle: 10000         // Time (in ms) before releasing an idle connection
  },
  dialectOptions: {
    connectTimeout: 5000 // Fail connection attempt after 5 seconds if RDS is down
  }
});

exports.sequelize = sequelize;
