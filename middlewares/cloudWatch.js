

const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch({
  region: 'us-east-1'  // Set your AWS region here
});

const sendToCloudWatch = (metricName, value, unit = 'Milliseconds') => {
  const params = {
    MetricData: [
      {
        MetricName: metricName,
        Dimensions: [
          {
            Name: 'API',
            Value: metricName
          }
        ],
        Unit: unit,
        Value: value,
      },
    ],
    Namespace: 'MyApp/Performance', // Customize your namespace
  };

  cloudwatch.putMetricData(params, (err, data) => {
    if (err) {
      console.error('Error sending metrics to CloudWatch', err);
    } else {
      console.log('Metrics sent to CloudWatch successfully:', data);
    }
  });
};

module.exports = { sendToCloudWatch };
