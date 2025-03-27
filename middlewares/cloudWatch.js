const statsd = require('../config/statsd'); // Import StatsD client from config

/**
 * Tracks API request duration
 */
const trackApiDuration = async (metricName, func) => {
    const startTime = Date.now();
    try {
        return await func();
    } finally {
        const duration = Date.now() - startTime;
        statsd.timing(`${metricName}.duration`, duration);
    }
};

/**
 * Tracks database query execution time
 */
const trackDbQuery = async (metricName, func) => {
    const startTime = Date.now();
    try {
        return await func();
    } finally {
        const duration = Date.now() - startTime;
        statsd.timing(`database.${metricName}.duration`, duration);
    }
};

/**
 * Tracks S3 operation duration
 */
const trackS3Call = async (metricName, func) => {
    const startTime = Date.now();
    try {
        return await func();
    } finally {
        const duration = Date.now() - startTime;
        statsd.timing(`s3.${metricName}.duration`, duration);
    }
};

/**
 * Increments StatsD counters
 */
const incrementMetric = (metricName) => {
    if (!statsd || !statsd.increment) {
        console.error("StatsD client is not properly initialized.");
        return;
    }
    statsd.increment(metricName);
};

module.exports = {
    trackApiDuration,
    trackDbQuery,
    trackS3Call,
    incrementMetric
};

// const statsd = require('../config/statsd'); // Import StatsD client from config

// /**
//  * Tracks API request duration
//  */
// const trackApiDuration = async (req, func) => {
//     const startTime = Date.now();
//     const method = req.method;
//     const routePath = req.route.path;

//     try {
//         return await func();
//     } finally {
//         const duration = Date.now() - startTime;
//         // Using the dynamic method and path to track the duration
//         statsd.timing(`${method}:${routePath}.duration`, duration);
//     }
// };

// /**
//  * Tracks database query execution time
//  */
// const trackDbQuery = async (metricName, func) => {
//     const startTime = Date.now();
//     try {
//         return await func();
//     } finally {
//         const duration = Date.now() - startTime;
//         statsd.timing(`database.${metricName}.duration`, duration);
//     }
// };

// /**
//  * Tracks S3 operation duration
//  */
// const trackS3Call = async (metricName, func) => {
//     const startTime = Date.now();
//     try {
//         return await func();
//     } finally {
//         const duration = Date.now() - startTime;
//         statsd.timing(`s3.${metricName}.duration`, duration);
//     }
// };

// /**
//  * Increments StatsD counters
//  */


// const incrementMetric = (req, event) => {
//     if (!statsd || !statsd.increment) {
//       console.error("StatsD client is not properly initialized.");
//       return;
//     }
  
//     const method = req.method;
//     console.log('Route:', req.route);  // Debugging line
//     console.log('Original URL:', req.originalUrl);  // Debugging line
  
//     const routePath = req.route ? req.route.path : req.originalUrl;
  
//     statsd.increment(`${method}:${routePath}.${event}`);
//   };
  

// module.exports = {
//     trackApiDuration,
//     trackDbQuery,
//     trackS3Call,
//     incrementMetric
// };



// const statsd = require('../config/statsd'); // Import StatsD client from config

// /**
//  * Tracks API request duration
//  */
// const trackApiDuration = async (req, func) => {
//     const startTime = Date.now();
//     const method = req.method;
    
//     // Use route path if available, otherwise fallback to original URL
//     const routePath = req.route ? req.route.path : req.originalUrl;

//     try {
//         return await func();
//     } finally {
//         const duration = Date.now() - startTime;
//         const metricName = `${method}-${routePath.replace(/\//g, '-')}.duration`;
//         console.log(`Sending metric for API duration: ${metricName} = ${duration}ms`);
//         statsd.timing(metricName, duration);
//     }
// };

// /**
//  * Tracks database query execution time
//  */
// const trackDbQuery = async (metricName, func) => {
//     const startTime = Date.now();
//     try {
//         return await func();
//     } finally {
//         const duration = Date.now() - startTime;
//         const sanitizedMetricName = `database.${metricName.replace(/[^a-zA-Z0-9._-]/g, '')}.duration`;
//         console.log(`Sending metric for DB query duration: ${sanitizedMetricName} = ${duration}ms`);
//         statsd.timing(sanitizedMetricName, duration);
//     }
// };

// /**
//  * Tracks S3 operation duration
//  */
// const trackS3Call = async (metricName, func) => {
//     const startTime = Date.now();
//     try {
//         return await func();
//     } finally {
//         const duration = Date.now() - startTime;
//         const sanitizedMetricName = `s3.${metricName.replace(/[^a-zA-Z0-9._-]/g, '')}.duration`;
//         console.log(`Sending metric for S3 call duration: ${sanitizedMetricName} = ${duration}ms`);
//         statsd.timing(sanitizedMetricName, duration);
//     }
// };

// /**
//  * Increments StatsD counters
//  */
// const incrementMetric = (req, event) => {
//     if (!statsd || !statsd.increment) {
//         console.error("StatsD client is not properly initialized.");
//         return;
//     }

//     const method = req.method;
    
//     // Use route path if available, otherwise fallback to original URL
//     const routePath = req.route ? req.route.path : req.originalUrl;

//     const metricName = `${method}-${routePath.replace(/\//g, '-')}.${event}`;
//     console.log(`Incrementing counter for: ${metricName}`);
//     statsd.increment(metricName);
// };

// module.exports = {
//     trackApiDuration,
//     trackDbQuery,
//     trackS3Call,
//     incrementMetric
// };
