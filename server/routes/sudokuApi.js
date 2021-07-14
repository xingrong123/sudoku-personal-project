const router = require("express").Router();
const db = require("../db");
const authorize = require("../middleware/authorize");
const checkUser = require("../middleware/checkUser");

router.get("/puzzlescount", authorize, async (req, res) => {
  try {
    const results = await db.query("SELECT puzzle_id, difficulty FROM sudoku_puzzles");
    if (req.user) {
      const username = req.user;
      const results2 = await db.query(`
        SELECT puzzle_id, time_spent, false AS completed
          FROM puzzle_progress AS pp1
          WHERE username=$1
            AND NOT EXISTS (
              SELECT puzzle_id
                FROM puzzle_win
                WHERE username=pp1.username
                  AND puzzle_id=pp1.puzzle_id
            )
        UNION
        SELECT puzzle_id, time_spent, true AS completed
          FROM puzzle_win
          WHERE username=$1`,
        [username]
      );
      return res.json({
        puzzles: results.rows,
        wins: results2.rows
      })
    }
    return res.json({ puzzles: results.rows });
  } catch (err) {
    console.error(err)
  }
})

router.get("/puzzle/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const results = await db.query(
      "SELECT * FROM sudoku_puzzles WHERE puzzle_id = $1", [id]
    );
    if (!results.rows.length) {
      return res.status(404).send("page not found");
    }
    return res.status(200).json(results.rows[0]);
  } catch (error) {
    console.error(error)
  }
})

router.post("/save", authorize, checkUser, async (req, res) => {
  try {
    const username = req.user;

    const { puzzle_id, moves, squares, history, time_spent } = req.body;

    // console.log(username, puzzle_id, moves, squares, history)
    await db.query(
      "INSERT INTO puzzle_progress(username, puzzle_id, moves, squares, history, time_spent) " +
      "VALUES ($1, $2, $3, $4, $5, $6) " +
      "ON CONFLICT (username, puzzle_id) DO UPDATE SET moves = $3, squares = $4, history = $5, time_spent = $6",
      [username, puzzle_id, moves, squares, JSON.stringify(history), time_spent]
    );
    res.status(200).json("saved successfully");
  } catch (err) {
    console.error(err)
    res.status(401).send("Not Authenticated")
  }
})

router.post("/load", authorize, checkUser, async (req, res) => {
  try {
    const username = req.user;

    const { puzzle_id } = req.body;
    const results = await db.query(
      "SELECT moves, squares, history, time_spent FROM puzzle_progress WHERE username = $1 and puzzle_id = $2", [username, puzzle_id]
    );
    res.status(200).json(results.rows);
  } catch (error) {
    console.error(error)
    res.status(401).send("Not Authenticated")
  }
})

router.post("/win", authorize, checkUser, async (req, res) => {
  try {
    const username = req.user;
    const { puzzle_id, time_spent } = req.body;
    await db.query(
      "INSERT INTO puzzle_win VALUES ($1, $2, $3)", [username, puzzle_id, time_spent]
    );
    res.status(200).json(`Puzzle completed in ${time_spent}`);
  } catch (error) {
    console.error(error)
  }
})

module.exports = router;