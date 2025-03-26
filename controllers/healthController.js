// // const  {StatusCode} = require('http-status');
// // const { sequelize } = require('../config/sequelize');
// // const { HealthCheck } = require('../models');
 
// // const health = async (req, res,fileUpload) => {
// //   try {
// //     console.log('Health check request received');
 
    
// //     if ((Object.keys(req.body || {}).length > 0 || Object.keys(req.query || {}).length > 0 ) && !fileUpload){
// //       console.log('Bad Request: Payload detected');
// //       return res.status(400).send(); // 400 Bad Request
// //     }
 
// //     await sequelize.authenticate();
// //     await HealthCheck.create({});
 
// //     console.log('Health check successful. Sending status: 200');
    
// //     return fileUpload ? { statusCode: 200 } :res.status(200).send(); // OK
// //   } catch (error) {
// //    // console.error('Health check failed. Error:', error.message);
// //     console.log('Sending status: 503');
// //     return fileUpload ? { statusCode: 503 }: res.status(503).send();
// //   }
// // };
 
// // module.exports = { health };


// const { StatusCode } = require('http-status');
// const { sequelize } = require('../config/sequelize');
// const { HealthCheck } = require('../models');
// const log = require('../config/logger');

// const health = async (req, res, fileUpload) => {
//   try {
//     log.info('Health check request received');

//     if ((Object.keys(req.body || {}).length > 0 || Object.keys(req.query || {}).length > 0) && !fileUpload) {
//       log.warn('Bad Request: Payload detected');
//       return res.status(400).send(); // 400 Bad Request
//     }

//     await sequelize.authenticate();
//     await HealthCheck.create({});

//     log.info('Health check successful. Sending status: 200');
//     return fileUpload ? { statusCode: 200 } : res.status(200).send(); // OK
//   } catch (error) {
//     log.error(`Health check failed. Error: ${error.message}`);
//     log.info('Sending status: 503');
//     return fileUpload ? { statusCode: 503 } : res.status(503).send();
//   }
// };

// module.exports = { health };

const { StatusCode } = require('http-status');
const { sequelize } = require('../config/sequelize');
const { HealthCheck } = require('../models');
const log = require('../config/logger');
const statsd = require('../config/statsd');  // Import StatsD client

const health = async (req, res, fileUpload) => {
  try {
    log.info('Health check request received');
    
    // Send metrics on health check request
    statsd.increment('health_check.requests');
    
    if ((Object.keys(req.body || {}).length > 0 || Object.keys(req.query || {}).length > 0) && !fileUpload) {
      log.warn('Bad Request: Payload detected');
      statsd.increment('health_check.bad_requests'); // Metric for bad requests
      return res.status(400).send(); // 400 Bad Request
    }

    await sequelize.authenticate();
    await HealthCheck.create({});
    log.info('Health check successful. Sending status: 200');
    statsd.increment('health_check.success');  // Metric for success

    return fileUpload ? { statusCode: 200 } : res.status(200).send(); // OK
  } catch (error) {
    log.error(`Health check failed. Error: ${error.message}`);
    log.info('Sending status: 503');
    statsd.increment('health_check.failure');  // Metric for failure
    return fileUpload ? { statusCode: 503 } : res.status(503).send();
  }
};

module.exports = { health };
