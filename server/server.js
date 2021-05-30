require('dotenv').config();
const express = require("express")
const cors = require("cors");
const db = require("./db")
const app = express()

app.use(cors());

// Middleware to reconize the incoming Request Object as a JSON Object.
app.use(express.json());

app.use((req, res, next) => {
  console.log("yeah our middle ware");
  next();
})

app.get("/", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM sudoku_puzzles");

    res.status(200).json({
      status: "success",
      data: results.rows
    });
  } catch (err) {
    console.log(err)
  }
})

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`server is up and listening on ${port}`);
});