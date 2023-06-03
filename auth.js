module.exports = function (req, res, next) {
  if (!process.env.API_KEY) {
    return next();
  }
  const authHeader = req.headers["api-key"];
  if (authHeader === process.env.API_KEY) {
    return next();
  }

  res.status(401).json({
    error: "Valid API key required",
  });
};
