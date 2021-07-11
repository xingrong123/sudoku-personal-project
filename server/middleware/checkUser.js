/**
 * Checks if there is a user, use this middleware after authorize if there needs to be a user.
 */
module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json("Not Authenticated")
  }

  next();
}