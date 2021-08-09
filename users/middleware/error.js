const ErrorResponse = require('../Utilities/ErrorResponse');

const errorhandler = (err, req, res, next) => {
  let error = { ...err };

  console.log(err.stack.red);

  error.message = err.message;
  //    Mongoose bad object ID
  if (err.name === 'CastError') {
    const message = `Resource not found with the id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  //   duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate Field Value Entered';
    error = new ErrorResponse(message, 400);
  }

  //   Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);

    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorhandler;
