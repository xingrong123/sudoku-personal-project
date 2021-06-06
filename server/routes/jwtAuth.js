const router = require("express").Router();
const db = require("../db");
const bcrypt = require('bcrypt');

// registering

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // check if user already exists
    const user = await db.query(
      "SELECT 1 FROM users WHERE username = $1", [username]
    )

    if (user.rows.length !== 0) {
      // 401 unauthenticated status code
      return res.status(401).send("user already exists");
    }

    // Bcrypt the user password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    // insert user into db
    const results = await db.query(
      "INSERT INTO users(username, password) VALUES ($1, $2) RETURNING *", [username, hash]
    );

    // generate jwt token

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error")
  }
})

module.exports = router;