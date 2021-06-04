require('dotenv').config();
const express = require("express")
const path = require('path');
const cors = require("cors");
const db = require("./db")
const app = express()

app.use(cors());

// app.use((req, res, next) => {
//   console.log("yeah our middle ware");
//   next();
// })

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/../client/build')));

// Middleware to reconize the incoming Request Object as a JSON Object.
app.use(express.json());

app.get("/api/puzzles", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM sudoku_puzzles");

    res.json({
      status: "success",
      data: results.rows
    });
  } catch (err) {
    console.log(err)
  }
})

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/../client/build/index.html'));
});

const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`server is up and listening on ${port}`);
});