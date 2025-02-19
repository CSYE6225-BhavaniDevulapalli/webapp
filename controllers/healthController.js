
const  {StatusCode} = require('http-status');
const { sequelize } = require('../config/sequelize');
const { HealthCheck } = require('../models');

const health = async (req, res) => {
  try {
    console.log('Health check request received');

    
    if (Object.keys(req.body || {}).length > 0 || Object.keys(req.query || {}).length > 0 ){
      console.log('Bad Request: Payload detected');
      return res.status(400).send(); // 400 Bad Request
    }

    await sequelize.authenticate();
    await HealthCheck.create({});

    console.log('Health check successful. Sending status: 200');
    return res.status(200).send();// 200 OK
  } catch (error) {
   // console.error('Health check failed. Error:', error.message);
    console.log('Sending status: 503');
    return res.status(503).send(); 
  }
};

module.exports = { health };
