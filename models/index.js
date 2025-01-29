const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const HealthCheck = require('./healthCheck')(sequelize, DataTypes);

module.exports = {
  sequelize,
  HealthCheck,
};
