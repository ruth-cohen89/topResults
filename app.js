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
    'CREATE TABLE scores(id int AUTO_INCREMENT, userName varchar(255) NOT NULL, game varchar(255) NOT NULL, score varchar(255) NOT NULL, PRIMARY KEY (id))';
  
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

// app.use(express.urlencoded({ extended: true, limit: '10kb' })); //?
app.use(express.json());

app.post('/adduser', (req, res) => {
  let user = { userName: req.body.userName, fullName: req.body.fullName };
  let sql = 'INSERT INTO users SET ?';

  db.query(sql, user, (err, result) => {
    if (err) {
      console.log(err);
      res.send(err);
    };

    res.status(201).json({
      status: 'success',
      data: {
        data: result,
      },
    });
  });
});

app.post('/submit', (req, res) => {
  let sql = 
  let score = { userName: req.body.userName, game: req.body.game, score: req.body.score };
  let sql = `SELECT score FROM scores WHERE userName=${score.userName} AND game=${score.game} AND score<${score.score}`;
  db.query
  if()
  sql = 'INSERT INTO scores SET ?';

  db.query(sql, score, (err, result) => {
    if (err) {
      console.log(err);
      if (err.errno === 1062) {
        res.send('User name already exits, please choose another one.');
      }
      if (err.errno === 1) {
        res.send('User name already exits, please choose another one.');
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

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server 🙄`, 404));
});

app.use(globalErrorHandler);

createUsersTable();
createTopScoresTable();
module.exports = app;