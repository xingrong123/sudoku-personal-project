const router = require("express").Router();
const db = require("../db");

router.get("/puzzlescount", async (req, res) => {
  try {
    const results = await db.query("SELECT id, difficulty FROM sudoku_puzzles");
    return res.json(results.rows);
  } catch (err) {
    console.error(err)
  }
})

router.get("/puzzle/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const results = await db.query(
      "SELECT * FROM sudoku_puzzles WHERE id = $1", [id]
    );
    if (results.rows.length) {
      return res.status(200).json(results.rows[0]);
    }
    return res.status(404).send("page not found");
  } catch (error) {
    console.error(error)
  }
})

router.post("/save", async (req, res) => {
  try {
    const { username, puzzle_id, moves, squares, history, time_spent } = req.body;
    // console.log(username, puzzle_id, moves, squares, history)
    const result = await db.query(
      "INSERT INTO puzzle_progress(username, puzzle_id, moves, squares, history, time_spent) " + 
        "VALUES ($1, $2, $3, $4, $5, $6) " + 
        "ON CONFLICT (username, puzzle_id) DO UPDATE SET moves = $3, squares = $4, history = $5",
      [username, puzzle_id, moves, squares, JSON.stringify(history), time_spent]
    );
    res.status(200).json("saved successfully");
  } catch (err) {
    console.error(err)
  }
})

router.post("/load", async (req, res) => {
  try {
    const {username, puzzle_id} = req.body;
    const results = await db.query(
      "SELECT moves, squares, history, time_spent FROM puzzle_progress WHERE username = $1 and puzzle_id = $2", [username, puzzle_id]
    );
    res.status(200).json(results.rows);
  } catch (error) {
    console.error(error)
  }
})

module.exports = router;