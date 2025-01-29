const { Sequelize } = require('sequelize');
const { sqlUri, database } = require('./variables');

const sequelize = new Sequelize(`${sqlUri}${database}`, {
    logging: false
});

exports.sequelize = sequelize;