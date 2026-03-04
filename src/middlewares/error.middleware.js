module.exports = function errorMiddleware(err, req, res, next) {
  console.error(err);

  const status = err.statusCode || 500;
  const code = err.code || "internal_error";

  res.status(status).json({
    error: code,
    message: err.message || "Unexpected error",
  });
};