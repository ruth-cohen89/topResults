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
  let sql =
    'CREATE TABLE Users(id int AUTO_INCREMENT, userName VARCHAR(255) UNIQUE NOT NULL, fullName VARCHAR(255) NOT NULL, PRIMARY KEY (id))';

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
  });
};

const createTopScoresTable = () => {
  let sql =
    'CREATE TABLE scores(id int AUTO_INCREMENT, userName varchar(255) NOT NULL, game varchar(255) NOT NULL, score int NOT NULL, PRIMARY KEY (id), foreign key(userName) references users(userName))';

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

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.post('/adduser', (req, res) => {
  let user = { userName: req.body.userName, fullName: req.body.fullName };
  let sql = 'INSERT INTO users SET ?';

  db.query(sql, user, (err, result) => {
    if (err) {
      console.log(err);
      if (err) {
        console.log(err);
        return res.status(400).json({
          status: 'client error',        
          message: err.sqlMessage
        });
      }
    }

    res.status(201).json({
      status: 'success',
      data: {
        data: result,
      },
    });
  });
});

app.post('/submit', (req, res) => {
  let score = {
    userName: req.body.userName,
    game: req.body.game,
    score: req.body.score,
  };

  let sql = `SELECT score FROM scores WHERE userName='${score.userName}' AND game='${score.game}'`;
  db.query(sql, (err, result) => {
    console.log('result:', result, result.length > 0);
    if (err) console.log(err);
    if (result.length > 0 && result[0].score >= score.score) {
      return res.status(200).json({
        status: 'success',
        data: {
          data: result,
        },
        message: `Your highest score is ${result[0].score}`,
      });
    }
    sql = '';
    if (result.length > 0) {
      sql = `DELETE FROM scores WHERE userName='${score.userName}' AND game='${score.game}';`; 
      db.query(sql, score, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(422).json({
            status: 'client error',        
          });
        }
      });
    }

    sql = 'INSERT INTO scores SET ?;';
    db.query(sql, score, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          status: 'client error',        
          message: err.sqlMessage
        });
      }

      res.status(201).json({
        status: 'success',
        data: {
          data: result,
        },
      });
    });
  });
});

app.get('/top-scores', (req, res) => {
  if (!req.query.game || !req.query.limit || !req.query.userName) return res.status(400).json({message: 'Missing fields'});
  let sql = `(SELECT score, userName from scores WHERE game='${req.query.game}' ORDER BY score DESC LIMIT ${req.query.limit}) UNION SELECT score, userName from scores WHERE game='${req.query.game}' AND userName='${req.query.userName}'`;
  db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          status: 'client error',        
          message: err.sqlMessage
        });
      }
    let userScore = result.find(score => score.userName === req.query.userName);
    sql = `SELECT COUNT(*) from scores WHERE game='${req.query.game}' AND score>'${userScore.score}'`;
    db.query(sql, (err, result2) => {
      if (err) {
        console.log(err);
        if (err) {
          console.log(err);
          return res.status(400).json({
            status: 'client error',        
            message: err.sqlMessage
          });
        }
      }
      
    res.status(200).json({
      status: 'success',
      data: {[`top ${req.query.limit}`]: result, [`${req.query.userName} place`]: result2[0]["COUNT(*)"]+1}
    });
  });
})
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server 🙄`, 404));
});

app.use(globalErrorHandler);

// createUsersTable();
// createTopScoresTable();
module.exports = app;
