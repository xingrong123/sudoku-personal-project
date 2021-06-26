const jwt = require("jsonwebtoken");
const refreshAccessGenerator = require("../utils/refreshAccessGenerator");
require("dotenv").config();

/**
 * Checks if access and refresh tokens is valid. If tokens are empty, assume that there is no user logged in.
 */
module.exports = async (req, res, next) => {
  try {
    const refreshToken = req.cookies["refresh-token"];
    const accessToken = req.cookies["access-token"];
    if (!refreshToken) {
      // No token found, user is logged out
      return next();
    }

    try {
      const { user } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      req.user = user;
      res.set("username", user);
      res.cookie("access-token", accessToken, { httpOnly: true });
      res.cookie("refresh-token", refreshToken, { httpOnly: true })
    } catch (error) {
      // verification failed for access token
      const { user } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const newAccessToken = await refreshAccessGenerator(user, refreshToken);
      req.user = user;
      res.set("username", user);
      res.cookie("access-token", newAccessToken, { httpOnly: true });
      res.cookie("refresh-token", refreshToken, { httpOnly: true })
    }

    next();
  } catch (err) {
    console.error(err.message);
    return res.status(403).json("Not Authorized")
  }
}