const express = require('express');
const routes=require('../routes');
const setHeaders = require('../middlewares/setHeaders');

const app = express();
app.use(express.json());
app.use(setHeaders);
app.use(routes);
app.use((req, res) => {
    res.status(404).send(); // Send only the HTTP status code with no body
  });

module.exports = app;


