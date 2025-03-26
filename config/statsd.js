// config/statsd.js
const StatsD = require('hot-shots');
const client = new StatsD({
  host: 'localhost', // StatsD server hostname (default: localhost)
  port: 8125,        // StatsD server port (default: 8125)
  prefix: 'myapp.'   // Prefix for your metrics (optional)
});

module.exports = client;
