const StatsD = require('hot-shots');

const client = new StatsD({
  host: 'localhost',
  port: 8125,
  prefix: 'myapp.',
  debug: true,  // Should print metrics to console
  errorHandler: function (error) {
    console.error("StatsD error:", error);
  }
});

console.log("StatsD client initialized!");

module.exports = client;
