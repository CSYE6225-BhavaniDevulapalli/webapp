const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize'); // Import sequelize instance correctly

class Image extends Model {}

Image.init(
  {
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
  },
  {
    sequelize,  // Ensure sequelize instance is passed here
    tableName: 'images',
    timestamps: false,  // Set timestamps to false as per your requirement
  }
);

module.exports = Image;
