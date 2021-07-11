const router = require("express").Router();
const db = require("../db");
const bcrypt = require('bcrypt');
const jwtAccessGenerator = require('../utils/jwtAccessGenerator');
const jwtRefreshGenerator = require('../utils/jwtRefreshGenerator')
const validInfo = require('../middleware/validInfo');
const authorize = require('../middleware/authorize');
const { request } = require("express");
const checkUser = require("../middleware/checkUser");
// registering

router.post("/register", validInfo, async (req, res) => {
  try {
    const { username, password } = req.body;

    // check if user already exists
    const user = await db.query(
      "SELECT 1 FROM users WHERE username = $1", [username]
    )

    if (user.rows.length !== 0) {
      // 401 unauthenticated status code
      return res.status(401).json("user already exists");
    }

    // Bcrypt the user password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    // generate jwt token
    const accessToken = jwtAccessGenerator(username);
    const refreshToken = jwtRefreshGenerator(username);

    // insert user into db
    const ipAddress = req.ip;
    const message = await db.query(
      "SELECT register($1, $2, $3, $4)", [username, hash, refreshToken, ipAddress]
    );
    if (message.rows[0].register !== "success") {
      return res.status(500).send("Server error")
    }
    res.cookie("access-token", accessToken, { httpOnly: true })
    res.cookie("refresh-token", refreshToken, { httpOnly: true })
    res.set("username", username);
    res.json(null)

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error")
  }
});

router.post("/login", validInfo, async (req, res) => {
  try {
    const { username, password } = req.body;
    // insert user into db
    const user = await db.query(
      "SELECT * FROM users WHERE username = $1", [username]
    );

    if (user.rows.length === 0) {
      // 401 unauthenticated status code
      return res.status(401).json("username or password is incorrect");
    }

    // check if incoming password is the same as the database password
    const isValidPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!isValidPassword) {
      // 401 unauthenticated status code
      return res.status(401).json("username or password is incorrect");
    }


    // generate jwt token
    const accessToken = jwtAccessGenerator(username);
    const refreshToken = jwtRefreshGenerator(username);

    // insert refresh token into db
    const ipAddress = req.ip;
    const message = await db.query(
      "SELECT login($1, $2, $3)", [username, refreshToken, ipAddress]
    );
    if (message.rows[0].login !== "success") {
      return res.status(500).send("Server error")
    }
    res.cookie("access-token", accessToken, { httpOnly: true })
    res.cookie("refresh-token", refreshToken, { httpOnly: true })
    res.set("username", username);  
    res.json(null)

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error")
  }
});

router.delete("/logout", authorize, checkUser, async (req, res) => {
  try {
    console.log("logout username:", req.user)
    // update db to change refresh token of user to null
    const refreshToken = req.cookies["refresh-token"];
    const message = await db.query(
      "SELECT logout($1)", [refreshToken]
    );
    if (message.rows[0].logout !== "success") {
      return res.status(500).send("Server error")
    }
    res.cookie("access-token", "", { httpOnly: true, maxAge: 0 })
    res.cookie("refresh-token", "", { httpOnly: true, maxAge: 0 })
    return res.json(null)
  } catch (err) {
    console.error(err.message);
    res.status(401).send("Not Authenticated")
  }
})

router.get("/is-verify", authorize, checkUser, async (req, res) => {
  try {
    console.log("is-verify username:", req.user)
    res.set("username", req.user);
    return (
      res.json({ isAuthenticated: true })
    );
  } catch (err) {
    console.error(err.message);
    res.status(401).send("Not Authenticated")
  }
});

module.exports = router;