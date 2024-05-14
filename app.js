'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const { sequelize } = require('./models');

// Imported Routes
const Users = require('./routes/Users');
const Courses = require('./routes/Courses');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));


(async()=>{
  await sequelize.authenticate();
  console.log('connection made');

  await sequelize.sync({force: true});
})()

app.use(express.json())
// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

//  Users Routes
app.use('/api', Users);

// Courses Routes
app.use('/api', Courses);

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if(err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError'){
    const errors = err.errors.map( err => err.message);
    return res.status(400).send(errors);
  }


  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
