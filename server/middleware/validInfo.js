/**
 * Checks if username and password entered meets minimum requirement of non-empty
 */
module.exports = (req, res, next) => {
  const { username, password } = req.body;

  if (req.path === "/register" || req.path === "/login") {
    // checks if username or password is empty
    if (![username, password].every(Boolean)) {
      return res.status(403).json("missing credentials")
    }
  }

  next();
}