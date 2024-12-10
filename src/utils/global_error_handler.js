const Exception = require('./exception');

module.exports = (err, req, res, next) => {
  console.error(
    'Global Error Handler Caught an error, ',
    `Type: ${typeof err}`
  );

  if (process.env.ENVIRONMENT === undefined || !err.isOperational) {
    console.error(err);
  }

  err = handleError(err);

  // TODO message needs to be worked out here
  res.status(err.code ?? 500).json({
    status: false,
    message: err.message ?? 'Internal Server Error',
  });

  next();
};

const handleError = (err) => {
  if (err.isOperational) return err;

  let error;

  // TODO handle multiple kinds on unknown errors here
  if (err.code === '11000') {
    error = handleDuplicateDataError(err);
  } else {
    error = new Exception(`Some Error Occurred`, 500);
  }

  return error || err;
};

const handleDuplicateDataError = (err) => {
  console.error(err.data);

  return new Exception(`Property '${err.meta.target[0]}' already exists`, 400);
};
