const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const log = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.DailyRotateFile({
      filename: 'logs/webapp-%DATE%.log',  // Adjust log path to match EC2 path
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d' // keep logs for 14 days
    }),
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()) // For local console logging
    })
  ]
});

module.exports = log;
