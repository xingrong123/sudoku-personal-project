const router = require("express").Router();
const db = require("../db");
const authorize = require("../middleware/authorize");
const checkUser = require("../middleware/checkUser");

router.get("/puzzles", authorize, async (req, res) => {
  const query = `
  SELECT puzzle_id, time_spent, false AS completed
    FROM puzzle_progress_and_ratings
    WHERE username=$1 AND time_spent IS NOT NULL AND time_spent_to_complete IS NULL
  UNION
  SELECT puzzle_id, time_spent_to_complete AS time_spent, true AS completed
    FROM puzzle_progress_and_ratings
    WHERE username=$1 AND time_spent_to_complete IS NOT NULL;
  `
  try {
    const results = await db.query("SELECT puzzle_id, difficulty FROM sudoku_puzzles");
    if (req.user) {
      const username = req.user;
      const results2 = await db.query(query,
        [username]
      );
      return res.json({
        puzzles: results.rows,
        progress: results2.rows
      })
    }
    return res.json({ puzzles: results.rows });
  } catch (err) {
    console.error(err)
  }
})

router.get("/puzzle/:id", async (req, res) => {
  const query1 = `
    SELECT x.puzzle_id, x.puzzle, x.difficulty, COALESCE(y.avg_rating, 0) AS avg_rating
      FROM ((SELECT *
        FROM sudoku_puzzles AS k
        WHERE k.puzzle_id=$1) AS x 
      LEFT OUTER JOIN (SELECT j.puzzle_id, AVG(CAST(rating AS FLOAT)) AS avg_rating
        FROM puzzle_progress_and_ratings AS j
        WHERE j.puzzle_id=$1 
        GROUP BY j.puzzle_id) AS y 
        ON x.puzzle_id = y.puzzle_id);
  `
  const query2 = `
    SELECT comment_id, username, reply_to, comment, date_created
      FROM comments
      WHERE puzzle_id = $1
      ORDER BY date_created DESC
  `
  try {
    const { id } = req.params;
    const task1 = db.query(
      query1, [id]
    );
    const task2 = db.query(
      query2, [id]
    )
    const [results1, results2] = await Promise.all([task1, task2]);
    if (!results1.rows.length) {
      return res.status(404).send("page not found");
    }
    return res.json({ puzzle: results1.rows, comments: results2.rows });
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
      "INSERT INTO puzzle_progress_and_ratings(username, puzzle_id, moves, squares, history, time_spent) " +
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
      "SELECT moves, squares, history, time_spent FROM puzzle_progress_and_ratings WHERE username = $1 AND puzzle_id = $2 AND moves IS NOT NULL", [username, puzzle_id]
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
      "SELECT fn_insert_win($1, $2, $3)", [username, puzzle_id, time_spent]
    );
    res.status(200).json(`Puzzle completed in ${time_spent}`);
  } catch (error) {
    console.error(error)
  }
})

router.post("/rate", authorize, checkUser, async (req, res) => {
  try {
    const username = req.user;
    const { puzzle_id, rating } = req.body;
    await db.query(
      "SELECT fn_rate_puzzle($1, $2, $3)", [username, puzzle_id, rating]
    );
    res.status(200).json(`rate success`);
  } catch (error) {
    console.error(error)
  }
})

router.post("/comment", authorize, checkUser, async (req, res) => {
  const query = `
    INSERT INTO comments(username, puzzle_id, reply_to, comment, date_created) VALUES ($1, $2, $3, $4, NOW()::timestamp)
  `;
  try {
    const username = req.user;
    const { puzzle_id, reply_to, comment } = req.body;
    await db.query(
      query, [username, puzzle_id, reply_to, comment]
    );
    res.status(200).json(`comment saved`);
  } catch (error) {
    console.error(error)
  }
})

module.exports = router;