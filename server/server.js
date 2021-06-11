require('dotenv').config();
const express = require("express")
const path = require('path');
const cors = require("cors");
const app = express();

// middleware for 
app.use(cors());

// app.use((req, res, next) => {
//   console.log("yeah our middle ware");
//   next();
// })

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/../client/build')));

// Middleware to recognize the incoming Request Object as a JSON Object.
app.use(express.json());

app.use("/auth", require("./routes/jwtAuth"));

app.use("/api", require("./routes/sudokuApi"));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../client/build/index.html'));
});

const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`server is up and listening on ${port}`);
});