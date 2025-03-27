
// const { sequelize } = require('../config/sequelize');
// const { HealthCheck } = require('../models');
// const log = require('../config/logger');
// const { trackApiDuration, trackDbQuery, incrementMetric } = require('../middlewares/cloudWatch'); // Import metrics utilities

// const health = async (req, res, fileUpload) => {
//     return await trackApiDuration('GET:/healthz', async () => { // Track API request duration
//         try {
//             log.info('Health check request received');
//             incrementMetric('health_check.total_requests'); // Track total requests

//             if ((Object.keys(req.body || {}).length > 0 || Object.keys(req.query || {}).length > 0) && !fileUpload) {
//                 log.warn('Bad Request: Payload detected');
//                 incrementMetric('GET:/healthz.bad_requests'); // Track bad requests
//                 return res.status(400).send(); // 400 Bad Request (original)
//             }

//             await trackDbQuery('GET:/healthz.db_connection', async () => {
//                 await sequelize.authenticate();
//                 await HealthCheck.create({});
//             }); // Track database authentication + insert timing

//             incrementMetric('GET:/healthz.success'); // Track successful health checks

//             log.info('Health check successful. Sending status: 200');
//             return fileUpload ? { statusCode: 200 } : res.status(200).send(); // 200 OK (original)
//         } catch (error) {
//             log.error(`Health check failed. Error: ${error.message}`);
//             log.info('Sending status: 503');
//             incrementMetric('GET:/healthz.failure'); // Track failed health checks
//             return fileUpload ? { statusCode: 503 } : res.status(503).send(); // 503 Service Unavailable (original)
//         }
//     });
// };

// module.exports = { health };
const { sequelize } = require('../config/sequelize');
const { HealthCheck } = require('../models');
const log = require('../config/logger');
const { trackApiDuration, trackDbQuery, incrementMetric } = require('../middlewares/cloudWatch'); // Import metrics utilities

const health = async (req, res, fileUpload) => {
    return await trackApiDuration(req, async () => { // Track API request duration dynamically based on req
        try {
            log.info('Health check request received');
            incrementMetric(req, 'requests'); // Track total requests dynamically based on method and route

            if ((Object.keys(req.body || {}).length > 0 || Object.keys(req.query || {}).length > 0) && !fileUpload) {
                log.warn('Bad Request: Payload detected');
                incrementMetric(req, 'bad_requests'); // Track bad requests dynamically based on method and route
                return res.status(400).send(); // 400 Bad Request
            }

            // Track database authentication + insert timing dynamically
            await trackDbQuery('health_check.db_connection', async () => {
                await sequelize.authenticate();
                await HealthCheck.create({});
            });

            incrementMetric(req, 'success'); // Track successful health checks dynamically based on method and route

            log.info('Health check successful. Sending status: 200');
            return fileUpload ? { statusCode: 200 } : res.status(200).send(); // 200 OK
        } catch (error) {
            log.error(`Health check failed. Error: ${error.message}`);
            log.info('Sending status: 503');
            incrementMetric(req, 'failure'); // Track failed health checks dynamically based on method and route
            return fileUpload ? { statusCode: 503 } : res.status(503).send(); // 503 Service Unavailable
        }
    });
};

module.exports = { health };
