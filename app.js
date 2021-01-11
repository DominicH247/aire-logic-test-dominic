const express = require('express');
const app = express();
app.use(express.json());

const {errorHandler, handleServerError500, handleInvalidPath404} = require('./errors');
const apiRouter = require('./routers/apiRouter');

// routes
app.use('/api', apiRouter);

// error handlers
app.use(errorHandler);
app.use(handleServerError500);
app.all("/*", handleInvalidPath404);

module.exports = app;
