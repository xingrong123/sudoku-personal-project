const db = require("../db");
require("dotenv").config();
const jwtAccessGenerator = require("./jwtAccessGenerator")

/**
 * Checks the validity of refresh token and returns a new access token
 * @param {string} user
 * @param {string} refreshToken 
 * @returns an access token
 */
async function refreshAccessGenerator(user, refreshToken) {
  try {
    const message = await db.query("SELECT checkRefreshToken($1, $2)", [user, refreshToken]);
    if (message.rows[0].checkRefreshToken !== "success") {
      throw Error("invalid refresh token")
    }
    return jwtAccessGenerator(user)
  } catch (error) {
    throw error;
  }
}

module.exports = refreshAccessGenerator;