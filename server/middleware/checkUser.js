/**
 * Checks if there is a user, use this middleware after authorize if there needs to be a user.
 */
export default async (req, res, next) => {
  if (!req.user) {
    return res.status(403).json("Not Authorized")
  }

  next();
}