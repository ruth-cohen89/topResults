const express = require('express');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const mysql = require('mysql');
const app = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'top_scores',
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySql Connected...');
});

const createDB = () => {
  let sql = 'CREATE DATABASE top_scores';
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log('error connecting to db: ', result);
  });
};

const createUsersTable = () => {
  let sql = 'CREATE TABLE Users(id int AUTO_INCREMENT, userName VARCHAR(255) UNIQUE NOT NULL, fullName VARCHAR(255) NOT NULL, PRIMARY KEY (id))';

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
  });
};

const createTopScoresTable = () => {
  let sql = 'CREATE TABLE scores(id int AUTO_INCREMENT, userName varchar(255) NOT NULL, game varchar(255) NOT NULL, score int NOT NULL, PRIMARY KEY (id), foreign key(userName) references users(userName))';

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
  });
  sql = 'ALTER TABLE scores ADD UNIQUE unique_index(userName, game)';

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
  });
};

const dbQuery = async (sql, res, data = '') => {
  return new Promise((resolve, reject) => {
    db.query(sql, data, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          status: 'client error',
          message: err.sqlMessage,
        });
      }
      resolve(result);
    });
  });
};

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.post('/adduser', async (req, res) => {
  let user = { userName: req.body.userName, fullName: req.body.fullName };
  let sql = 'INSERT INTO users SET ?';
  const result = await dbQuery(sql, res, user);

  res.status(201).json({
    status: 'success',
    data: {
      data: result,
    },
  });
});

app.post('/submit', async (req, res) => {
  let score = {
    userName: req.body.userName,
    game: req.body.game,
    score: req.body.score,
  };

  let sql = `SELECT score FROM scores WHERE userName='${score.userName}' AND game='${score.game}'`;
  let result = await dbQuery(sql, res);

  if (result.length > 0 && result[0].score >= score.score) {
    return res.status(200).json({
      status: 'success',
      data: {
        data: result,
      },
      message: `Your highest score is ${result[0].score}`,
    });
  }

  if (result.length > 0) {
    sql = `DELETE FROM scores WHERE userName='${score.userName}' AND game='${score.game}';`;
    result = await dbQuery(sql, res, score);
  }

  sql = 'INSERT INTO scores SET ?;';
  result = await dbQuery(sql, res, score);

  res.status(201).json({
    status: 'success',
    data: {
      data: result,
    },
  });
});

app.get('/top-scores', async (req, res) => {
  if (!req.query.game || !req.query.limit || !req.query.userName)
    return res.status(400).json({ message: 'Missing fields' });
  let sql = `SELECT score, userName from scores WHERE game='${req.query.game}' ORDER BY score DESC LIMIT ${req.query.limit}`;
  let top_scores = await dbQuery(sql, res);

  sql = `SELECT score, userName from scores WHERE game='${req.query.game}' AND userName='${req.query.userName}'`;
  let userScore = await dbQuery(sql, res);
  top_scores.map((s, i) => {
    s.place = i + 1;
  });
  console.log(top_scores);

  sql = `SELECT COUNT(*) from scores WHERE game='${req.query.game}' AND score>'${userScore[0].score}'`;
  let user_index = await dbQuery(sql, res);

  res.status(200).json({
    status: 'success',
    data: {
      'your-result': {
        score: userScore[0].score,
        place: user_index[0]['COUNT(*)'] + 1,
      },
      'top-results': top_scores,
    },
  });
});

app.patch('/updateuser/:id', async (req, res) => {
  let sql = `UPDATE users SET fullName = '${req.body.fullName}' WHERE id = ${req.params.id}`;
  let result = await db.query(sql, res);
  res.status(200).json({
    status: 'success',
    data: result
  });
});

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'Not Found',
    data: `Can't find ${req.originalUrl} on the server`
  });
});

app.use(globalErrorHandler);

// createUsersTable();
// createTopScoresTable();
module.exports = app;