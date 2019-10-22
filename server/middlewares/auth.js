const checkAuth = (req, res, next) => {
  const { user, headers, session } = req;
  console.log("USER", user, "HEADER", headers, "SESS", session);
  if (req.isAuthenticated()) return next();
  res.status(403).json({
    message: "access denied"
  });
};

module.exports = checkAuth;
