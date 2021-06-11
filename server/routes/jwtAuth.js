const router = require("express").Router();
const db = require("../db");
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');
const validInfo = require('../middleware/validInfo');
const authorize = require('../middleware/authorize');
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

    // insert user into db
    const newUser = await db.query(
      "INSERT INTO users(username, password) VALUES ($1, $2) RETURNING *", [username, hash]
    );

    // generate jwt token
    const token = jwtGenerator(newUser.rows[0].username);

    res.json(
      { token }
    )

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
    console.log(isValidPassword)
    if (!isValidPassword) {
      // 401 unauthenticated status code
      return res.status(401).json("username or password is incorrect");
    }

    // generate jwt token
    const token = jwtGenerator(user.rows[0].username);

    res.json(
      { token }
    )

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error")
  }
});

router.get("/is-verify", authorize, async (req, res) => {
  try {
    console.log(req.user)
    res.json({
      isAuthenticated: true,
      username: req.user
    })
  } catch (err) {
    console.error(err.message);
    res.status(401).send("Server error")
  }
});

module.exports = router;