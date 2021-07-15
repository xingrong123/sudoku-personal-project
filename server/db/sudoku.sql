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

-- DROP DATABASE IF EXISTS sudoku_db;
-- CREATE DATABASE sudoku_db;
-- \c sudoku_db;

DROP TRIGGER IF EXISTS tr_check_number_of_row ON login_info;
DROP FUNCTION IF EXISTS fn_get_puzzle_progress_with_time;
DROP FUNCTION IF EXISTS fn_rate_puzzle;
DROP FUNCTION IF EXISTS fn_get_puzzle_with_avg_rating;
DROP FUNCTION IF EXISTS fn_insert_win;
DROP FUNCTION IF EXISTS fn_register;
DROP FUNCTION IF EXISTS fn_login;
DROP FUNCTION IF EXISTS fn_logout;
DROP FUNCTION IF EXISTS fn_check_refresh_token;
DROP TABLE IF EXISTS puzzle_win;
DROP TABLE IF EXISTS puzzle_progress;
DROP TABLE IF EXISTS sudoku_puzzles;
DROP TABLE IF EXISTS login_info;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS DIFFICULTY_LEVEL;

CREATE TYPE DIFFICULTY_LEVEL AS ENUM (
  'easy',
  'medium',
  'hard',
  'expert'
);

CREATE TABLE sudoku_puzzles (
  puzzle_id SERIAL PRIMARY KEY,
  puzzle INTEGER[81] NOT NULL UNIQUE,
  difficulty DIFFICULTY_LEVEL NOT NULL
);

CREATE TABLE users (
  username VARCHAR(255) PRIMARY KEY,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE login_info (
  username VARCHAR(255) REFERENCES users(username) NOT NULL,
  refresh_token VARCHAR(255) PRIMARY KEY,
  login_time TIMESTAMP NOT NULL,
  logged_in BOOLEAN NOT NULL,
  ip_address INET NOT NULL
);

CREATE TABLE puzzle_progress_and_ratings (
  username VARCHAR(255) REFERENCES users(username),
  puzzle_id INTEGER REFERENCES sudoku_puzzles(puzzle_id),
  moves INTEGER,
  squares INTEGER[81],
  history JSON,
  time_spent TIME WITHOUT TIME ZONE,
  time_spent_to_complete TIME WITHOUT TIME ZONE,
  rating INTEGER CHECK (rating > 0 AND rating < 6),
  PRIMARY KEY(username, puzzle_id)
);

CREATE TABLE comments (
  comment_id SERIAL PRIMARY KEY,
  username VARCHAR(255) REFERENCES users(username) NOT NULL,
  puzzle_id INTEGER REFERENCES sudoku_puzzles(puzzle_id) NOT NULL,
  reply_to INTEGER REFERENCES comments(comment_id),
  comment TEXT NOT NULL
);

INSERT INTO sudoku_puzzles(puzzle, difficulty) VALUES 
  ('{9,null,null,null,null,null,null,null,1,null,null,7,8,3,1,6,4,9,6,1,null,5,4,null,8,null,null,null,null,null,1,null,null,null,null,6,7,4,5,null,9,6,2,null,null,null,null,6,null,null,4,7,5,null,3,7,null,4,null,null,9,null,2,4,null,null,null,6,null,null,8,5,5,null,1,null,null,8,null,null,null}', 'easy'),
  ('{null,null,9,null,null,1,null,null,null,null,null,null,null,4,9,null,null,null,3,null,null,null,null,null,1,8,null,4,null,7,5,null,8,null,null,6,null,8,null,null,null,2,9,null,7,null,1,null,null,null,null,null,5,null,null,6,5,4,2,null,3,9,null,7,null,1,6,null,null,null,null,5,null,null,null,9,null,null,null,6,null}', 'easy'),
  ('{null,9,2,null,1,null,null,null,3,7,null,null,null,4,3,9,null,null,6,null,1,7,null,2,null,null,null,9,5,null,null,null,null,null,2,null,3,null,4,null,5,null,1,null,9,null,2,null,null,null,null,null,4,5,null,null,null,8,null,6,5,null,4,null,null,6,4,3,null,null,null,1,5,null,null,null,2,null,8,6,null}', 'easy'),
  ('{null,null,null,null,null,null,null,4,null,3,null,null,null,null,1,7,2,null,null,5,null,null,null,null,8,null,null,null,null,null,null,null,2,null,null,null,null,null,null,5,6,null,null,null,null,6,null,3,null,null,7,2,null,4,1,3,null,null,8,null,null,7,null,5,9,null,null,3,null,1,null,2,null,null,4,2,null,9,null,null,8}', 'easy'),
  ('{null,null,null,null,2,null,1,null,5,null,null,9,null,null,8,null,7,null,null,6,null,null,4,null,2,null,null,null,null,null,4,null,9,5,null,7,null,null,5,null,8,1,null,null,null,null,9,6,7,3,null,null,2,null,null,null,4,5,null,3,null,null,null,2,null,7,null,null,null,null,null,null,6,1,null,8,null,null,4,null,null}', 'medium'),
  ('{null,null,null,9,6,null,null,5,1,null,1,null,null,7,4,null,null,2,null,null,null,1,null,null,null,null,null,null,2,null,null,null,null,null,null,null,9,6,null,7,5,3,2,null,null,4,5,null,null,1,8,3,null,null,5,null,2,null,4,9,null,1,3,null,null,9,null,null,null,null,null,7,null,null,null,8,null,null,null,null,null}', 'medium'),
  ('{null,2,null,5,4,null,null,1,null,null,null,null,8,null,1,null,5,null,5,null,null,6,7,null,null,null,4,4,9,null,null,null,null,null,null,2,null,null,null,null,null,null,7,4,5,null,null,3,null,null,null,null,null,null,null,6,null,null,null,null,3,null,8,1,null,null,null,6,3,null,null,null,null,null,4,null,null,null,null,null,null}', 'hard'),
  ('{null,null,null,null,null,null,null,null,null,null,null,7,5,null,null,null,null,1,null,9,null,null,6,null,null,null,4,null,null,9,null,null,8,4,null,null,null,null,2,4,null,null,null,null,5,null,null,null,null,null,null,3,8,null,null,1,null,7,null,null,null,null,9,null,6,null,null,null,5,null,1,3,null,3,null,8,null,null,null,null,null}', 'hard'),
  ('{4,null,null,6,null,null,null,null,null,null,null,2,null,3,null,null,null,null,null,null,null,null,null,9,8,2,7,8,null,null,4,1,null,null,null,null,9,null,null,null,null,null,null,null,5,null,6,null,null,null,null,null,7,null,null,3,null,null,null,null,4,null,6,null,null,null,null,9,6,2,null,null,null,9,null,null,null,null,null,5,null}', 'expert'),
  ('{null,null,2,null,8,5,null,null,4,null,null,null,null,3,null,null,6,null,null,null,4,2,1,null,null,3,null,null,null,null,null,null,null,null,5,2,null,null,null,null,null,null,3,1,null,9,null,null,null,null,null,null,null,null,8,null,null,null,null,6,null,null,null,2,5,null,4,null,null,null,null,8,null,null,null,null,null,1,6,null,null}', 'expert');


-- if puzzle not in table, then user has not attempted puzzle. 
-- if completed is true, user has completed puzzle. 
-- if completed is false, user has attempted puzzle but not completed it.
CREATE OR REPLACE FUNCTION
fn_get_puzzle_progress_with_time(
  username1 VARCHAR(255)
)
RETURNS TABLE(
  puzzle_id INTEGER,
  time_spent TIME WITHOUT TIME ZONE,
  completed BOOLEAN
) AS
$$
#variable_conflict use_column 
  BEGIN 
    RETURN QUERY 
      SELECT puzzle_id, time_spent, false AS completed
        FROM puzzle_progress_and_ratings
        WHERE username=$1 AND time_spent IS NOT NULL AND time_spent_to_complete IS NULL
      UNION
      SELECT puzzle_id, time_spent_to_complete AS time_spent, true AS completed
        FROM puzzle_progress_and_ratings
        WHERE username=$1 AND time_spent_to_complete IS NOT NULL;
  END; $$
LANGUAGE plpgsql;


DROP FUNCTION IF EXISTS fn_get_puzzle_with_avg_rating;
CREATE OR REPLACE FUNCTION
fn_get_puzzle_with_avg_rating(
  puzzle_id1 INTEGER
)
RETURNS TABLE(
  puzzle_id INTEGER,
  puzzle INTEGER[81],
  difficulty DIFFICULTY_LEVEL,
  avg_rating FLOAT
) AS
$$
#variable_conflict use_column 
  BEGIN 
    RETURN QUERY 
      SELECT x.puzzle_id, x.puzzle, x.difficulty, COALESCE(y.avg_rating, 0)
        FROM ((SELECT *
          FROM sudoku_puzzles AS k
          WHERE k.puzzle_id=$1) AS x 
        LEFT OUTER JOIN (SELECT j.puzzle_id, AVG(CAST(rating AS FLOAT)) AS avg_rating
          FROM puzzle_progress_and_ratings AS j
          WHERE j.puzzle_id=$1 
          GROUP BY j.puzzle_id) AS y 
          ON x.puzzle_id = y.puzzle_id);
  END; $$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION
fn_insert_win(
  username1 VARCHAR(255),
  puzzle_id1 INTEGER,
  time_spent1 TIME WITHOUT TIME ZONE
)
RETURNS VARCHAR(30) AS
$$ DECLARE message1 VARCHAR(30);
  BEGIN 
    INSERT INTO puzzle_progress_and_ratings(username, puzzle_id, time_spent_to_complete) 
      VALUES ($1, $2, $3) 
      ON CONFLICT (username, puzzle_id) 
      DO UPDATE SET time_spent_to_complete=$3 
        WHERE time_spent_to_complete>$3;
    message1 := 'success';
    RETURN message1;
  END; $$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION
fn_rate_puzzle(
  username1 VARCHAR(255),
  puzzle_id1 INTEGER,
  rating1 INT
)
RETURNS VARCHAR(30) AS
$$ DECLARE message1 VARCHAR(30);
  BEGIN 
    INSERT INTO puzzle_progress_and_ratings(username, puzzle_id, rating) 
      VALUES ($1, $2, $3) 
      ON CONFLICT (username, puzzle_id) 
      DO UPDATE SET rating=$3;
    message1 := 'success';
    RETURN message1;
  END; $$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION
fn_register(
  username1 VARCHAR(255),
  hashPassword VARCHAR(255),
  refresh VARCHAR(255), 
  ipAddress INET
)
RETURNS VARCHAR(30) AS
$$ DECLARE message1 VARCHAR(30);
  BEGIN 
    INSERT INTO users(username, password) VALUES (username1, hashPassword); 
    INSERT INTO login_info(username, refresh_token, login_time, logged_in, ip_address) 
      VALUES (username1, refresh, NOW()::timestamp, true, ipAddress);
    message1 := 'success';
    RETURN message1;
  END; $$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION
fn_login(username1 VARCHAR(255),
  refresh VARCHAR(255), 
  ipAddress INET
)
RETURNS VARCHAR(30) AS
$$ DECLARE message1 VARCHAR(30);
  BEGIN 
    INSERT INTO login_info(username, refresh_token, login_time, logged_in, ip_address) 
      VALUES (username1, refresh, NOW()::timestamp, true, ipAddress);
    message1 := 'success';
    RETURN message1;
  END; $$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION
fn_logout(refresh VARCHAR(255))
RETURNS VARCHAR(30) AS
$$ DECLARE message1 VARCHAR(30);
  BEGIN 
    UPDATE login_info SET logged_in=false WHERE refresh_token=refresh;
    message1 := 'success';
    RETURN message1;
  END; $$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION
fn_check_refresh_token(
  username1 VARCHAR(255), 
  refresh VARCHAR(255)
)
RETURNS VARCHAR(30) AS
$$ DECLARE message1 VARCHAR(30);
  BEGIN 
    IF (1 <> (
      SELECT COUNT(*) 
        FROM login_info 
        WHERE username=username1 AND refresh_token=refresh AND logged_in=true))
    THEN
    message1 := 'invalid refresh token';
    RETURN message1;
    END IF;
    message1 := 'success';
    RETURN message1;
  END; $$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_number_of_row()
RETURNS TRIGGER AS
$body$
BEGIN
  -- replace 100 by the number of rows you want
  IF (SELECT count(*) FROM login_info) > 100
  THEN 
    DELETE FROM login_info 
      WHERE login_time
      IN (
        SELECT min(login_time) 
          FROM login_info
      );
  END IF;
  RETURN NEW;
END;
$body$
LANGUAGE plpgsql;

CREATE TRIGGER tr_check_number_of_row 
BEFORE INSERT ON login_info
FOR EACH ROW EXECUTE PROCEDURE check_number_of_row();