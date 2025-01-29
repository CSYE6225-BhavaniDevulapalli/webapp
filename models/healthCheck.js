module.exports = (sequelize, DataTypes) => {
    const HealthCheck = sequelize.define(
      'HealthCheck',
      {
        id: {
          type: DataTypes.INTEGER, 
          autoIncrement: true, 
          primaryKey: true, 
        },
        datetime: {
          type: DataTypes.DATE, 
          allowNull: false, 
          defaultValue: sequelize.literal('NOW()'), 
        },
      },
      {
        tableName: 'HealthChecks',
        timestamps: false, 
      }
    );
  
    return HealthCheck;
  };
  