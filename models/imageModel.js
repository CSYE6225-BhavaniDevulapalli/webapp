// // models/image.js
// const { Sequelize, DataTypes } = require('sequelize');
// const { sequelize } = require('../config/sequelize'); // Adjust the import path if necessary

// const Image = sequelize.define('Image', {
//   id: {
//     type: DataTypes.UUID,
//     defaultValue: DataTypes.UUIDV4,
//     primaryKey: true,
//   },
//   file_name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   url: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     validate: {
//       isUrl: true,
//     },
//   },
//   upload_date: {
//     type: DataTypes.DATEONLY,
//     allowNull: false,
//   },
// }, {
//   tableName: 'images',
//   timestamps: false,
// });

// module.exports = Image;
const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Image = sequelize.define('Image', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  file_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: true,
    },
  },
  upload_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  content_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  storage_class: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  etag: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  encryption_type: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'images',
  timestamps: false,
});

module.exports = Image;
