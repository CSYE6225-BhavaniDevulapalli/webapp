
const app = require('./config/express');
const { port, env } = require('./config/variables');
const { setupDatabase } = require('./config/database');
const { sequelize } = require('./models');

setupDatabase()
  .then(() => {
    console.log('Database setup completed.');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database schema synchronized.');
    app.listen(port, () => {
      console.log(`Server started on port ${port} (${env})`);
    });
  })
  .catch((err) => {
    console.error('Failed to start application:', err.message);
    process.exit(1); // Exit if setup fails
  });

