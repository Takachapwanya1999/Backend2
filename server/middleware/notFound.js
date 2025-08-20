export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  // Attach statusCode so global error handler can preserve 404
  error.statusCode = 404;
  next(error);
};
