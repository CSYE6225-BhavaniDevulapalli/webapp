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


const { sequelize } = require('../config/sequelize');
const { HealthCheck } = require('../models');
const log = require('../config/logger');
const { trackApiDuration, trackDbQuery, incrementMetric } = require('../middlewares/cloudWatch'); // Import metrics utilities

const health = async (req, res, fileUpload) => {
    return await trackApiDuration('health_check', async () => { // Track API request duration
        try {
            log.info('Health check request received');
            incrementMetric('health_check.total_requests'); // Track total requests

            if ((Object.keys(req.body || {}).length > 0 || Object.keys(req.query || {}).length > 0) && !fileUpload) {
                log.warn('Bad Request: Payload detected');
                incrementMetric('health_check.bad_requests'); // Track bad requests
                return res.status(400).send(); // 400 Bad Request (original)
            }

            await trackDbQuery('health_check.db_connection', async () => {
                await sequelize.authenticate();
                await HealthCheck.create({});
            }); // Track database authentication + insert timing

            incrementMetric('health_check.success'); // Track successful health checks

            log.info('Health check successful. Sending status: 200');
            return fileUpload ? { statusCode: 200 } : res.status(200).send(); // 200 OK (original)
        } catch (error) {
            log.error(`Health check failed. Error: ${error.message}`);
            log.info('Sending status: 503');
            incrementMetric('health_check.failure'); // Track failed health checks
            return fileUpload ? { statusCode: 503 } : res.status(503).send(); // 503 Service Unavailable (original)
        }
    });
};

module.exports = { health };
