const express = require('express');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const mysql = require('mysql');
const app = express();

const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database: 'top_scores'
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
}

const createUsersTable = () => {
  let sql = 'CREATE TABLE Users(id int AUTO_INCREMENT, userName VARCHAR(255) UNIQUE, FirstName VARCHAR(255), PRIMARY KEY (id))';
  
  db.query(sql, (err, result) => {
    if(err) throw err; 
    console.log(result);
  });
}

const createTopScoresTable = () => {
  let sql = 'CREATE TABLE Scores(id int AUTO_INCREMENT, userName varchar(255), game varchar(255) UNIQUE, PRIMARY KEY (id))';
  
  db.query(sql, (err, result) => {
    if(err) throw err; 
    console.log(result);
  });
};

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.urlencoded({ extended: true, limit: '10kb' }));//?

app.post('/adduser', (req, res) => {
  let user = {userName:req.body.userName, firstName:req.body.firstName}
  let sql = 'INSERT INTO users SET ?'
  db.query(sql, (err, result) => {
    if(err) throw err; 
    console.log(result);
    res.send(`${req.body.userName} successfuly added`);
  });
});
 
app.post('/submit', (req, res) => {
  let score = {userName:req.body.userName, firstName:req.body.firstName}
  let sql = 'INSERT INTO scores SET ?'
  db.query(sql, (err, result) => {
    if(err) throw err; 
    console.log(result);
    res.send(`${req.body.userName} successfuly added`);
  });
});

// app.get('/adduser', (req, res) => {
//   let user = {userName:req.body.userName, firstName:req.body.email}
//   db.query(sql, (err, result) => {
//     if(err) throw err; 
//     console.log(result);
//     res.send('Scores table created...');
//   });
// });

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server 🙄`, 404));
});

app.use(globalErrorHandler);
createTopScoresTable()
module.exports = app;
