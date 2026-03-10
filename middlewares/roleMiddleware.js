const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `User role ${req.user ? req.user.role : 'Unknown'} is not authorized to access this route. Requires one of: ${roles.join(', ')}`,
      });
    }
    next();
  };
};

module.exports = { authorize };
