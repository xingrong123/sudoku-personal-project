-- run the following line in the folder containing sudoku.sql to edit the database on the sudoku app.
-- heroku pg:psql --app sudoku-react-application < sudoku.sql

-- use the following python code to generate values for the sudoku db
-- separate the lines using fullstop
/*
lines = "".split(".")
ans = ""
for line in lines:
    ans = ans + "  (\'{" + (",".join(line[i:i + 1] for i in range(0, len(line), 1)).replace("0", "null")) + "}\'),\n"
print(ans)
*/
/*
DROP DATABASE IF EXISTS sudoku_db;
CREATE DATABASE sudoku_db;
\c sudoku_db;
*/
DROP TABLE IF EXISTS puzzle_progress;
DROP TABLE IF EXISTS sudoku_puzzles;
DROP TABLE IF EXISTS users;



CREATE TABLE sudoku_puzzles (
  id SERIAL PRIMARY KEY,
  puzzle INTEGER[81] NOT NULL UNIQUE
);

CREATE TABLE users (
  username VARCHAR(255) PRIMARY KEY,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE puzzle_progress (
  username VARCHAR(255) REFERENCES users(username),
  puzzle_id INTEGER REFERENCES sudoku_puzzles(id),
  moves INTEGER NOT NULL,
  squares INTEGER[81] NOT NULL,
  history JSON NOT NULL,
  PRIMARY KEY(username, puzzle_id)
);

INSERT INTO sudoku_puzzles(puzzle) VALUES 
  ('{9,null,null,null,null,null,null,null,1,null,null,7,8,3,1,6,4,9,6,1,null,5,4,null,8,null,null,null,null,null,1,null,null,null,null,6,7,4,5,null,9,6,2,null,null,null,null,6,null,null,4,7,5,null,3,7,null,4,null,null,9,null,2,4,null,null,null,6,null,null,8,5,5,null,1,null,null,8,null,null,null}'),
  ('{null,null,9,null,null,1,null,null,null,null,null,null,null,4,9,null,null,null,3,null,null,null,null,null,1,8,null,4,null,7,5,null,8,null,null,6,null,8,null,null,null,2,9,null,7,null,1,null,null,null,null,null,5,null,null,6,5,4,2,null,3,9,null,7,null,1,6,null,null,null,null,5,null,null,null,9,null,null,null,6,null}'),
  ('{null,9,2,null,1,null,null,null,3,7,null,null,null,4,3,9,null,null,6,null,1,7,null,2,null,null,null,9,5,null,null,null,null,null,2,null,3,null,4,null,5,null,1,null,9,null,2,null,null,null,null,null,4,5,null,null,null,8,null,6,5,null,4,null,null,6,4,3,null,null,null,1,5,null,null,null,2,null,8,6,null}'),
  ('{null,null,null,null,null,null,null,4,null,3,null,null,null,null,1,7,2,null,null,5,null,null,null,null,8,null,null,null,null,null,null,null,2,null,null,null,null,null,null,5,6,null,null,null,null,6,null,3,null,null,7,2,null,4,1,3,null,null,8,null,null,7,null,5,9,null,null,3,null,1,null,2,null,null,4,2,null,9,null,null,8}');
