const router = require("express").Router();
const db = require("../db");

router.get("/puzzlescount", async (req, res) => {
  try {
    const results = await db.query("SELECT id FROM sudoku_puzzles");
    return res.json(results.rows);
  } catch (err) {
    console.log(err)
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
    console.log(error)
  }
})

module.exports = router;