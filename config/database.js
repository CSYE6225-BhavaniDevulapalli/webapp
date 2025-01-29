

const { Sequelize } = require('sequelize');
const { sqlUri, database } = require('./variables');

const setupDatabase = async () => {
  let sequelize;
  try {
    
    sequelize = new Sequelize(sqlUri, {
      logging: false,
    });

    
    await sequelize.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    console.log(`Database "${database}" created or already exists.`);
  } catch (error) {
    console.error('Failed to create or connect to the database:', error.message);
    throw error; 
  } finally {
   
    if (sequelize) {
      await sequelize.close();
    }
  }
};

module.exports = { setupDatabase };

