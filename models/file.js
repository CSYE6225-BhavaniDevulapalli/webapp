const { sequelize } = require('../config/sequelize'); // Import correctly
const { DataTypes } = require('sequelize');

const File = sequelize.define('File', {
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fileType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = File;
