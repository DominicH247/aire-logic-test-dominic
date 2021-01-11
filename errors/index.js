const { METHOD_NOT_ALLOWED, INVALID_PATH, SERVER_ERROR } = require('../constants/customErrors');

exports.errorHandler = (err, req, res, next) => {
    res.status(err.status).send({
        message: err.message,
    });
};

exports.handleServerError500 = (err, req, res, next) => {
    res.status(500).send({ message: SERVER_ERROR });
  };

exports.handleInvalidPath404 = (req, res, next) => {
    res.status(404).send({ message: INVALID_PATH });
};

exports.handleInvalidMethod405 = (req, res, next) => {
    res.status(405).send({ message: METHOD_NOT_ALLOWED });
};
