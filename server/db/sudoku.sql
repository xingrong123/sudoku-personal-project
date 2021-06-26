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
DROP FUNCTION IF EXISTS register;
DROP FUNCTION IF EXISTS login;
DROP FUNCTION IF EXISTS logout;
DROP FUNCTION IF EXISTS checkRefreshToken;
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
  username VARCHAR(255) REFERENCES users(username),
  refresh_token VARCHAR(255) PRIMARY KEY,
  login_time TIMESTAMP NOT NULL,
  logged_in BOOLEAN NOT NULL,
  ip_address INET NOT NULL
);

CREATE TABLE puzzle_progress (
  username VARCHAR(255) REFERENCES users(username),
  puzzle_id INTEGER REFERENCES sudoku_puzzles(puzzle_id),
  moves INTEGER NOT NULL,
  squares INTEGER[81] NOT NULL,
  history JSON NOT NULL,
  time_spent TIME WITHOUT TIME ZONE NOT NULL,
  PRIMARY KEY(username, puzzle_id)
);

CREATE TABLE puzzle_win (
  username VARCHAR(255) REFERENCES users(username),
  puzzle_id INTEGER REFERENCES sudoku_puzzles(puzzle_id),
  time_spent TIME WITHOUT TIME ZONE NOT NULL,
  PRIMARY KEY (username, puzzle_id)
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





CREATE OR REPLACE FUNCTION
register(username1 VARCHAR(255),
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
login(username1 VARCHAR(255),
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
logout(refresh VARCHAR(255))
RETURNS VARCHAR(30) AS
$$ DECLARE message1 VARCHAR(30);
  BEGIN 
    UPDATE login_info SET logged_in=false WHERE refresh_token=refresh;
    message1 := 'success';
    RETURN message1;
  END; $$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION
checkRefreshToken(
  username1 VARCHAR(255), 
  refresh VARCHAR(255)
)
RETURNS VARCHAR(30) AS
$$ DECLARE message1 VARCHAR(30);
  BEGIN 
    IF (1 = (
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