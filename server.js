const dotenv = require('dotenv');
const app = require('./app');
const mysql = require('mysql');

// Synchronous exeptions on the app
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! ⛔ Shutting down...');
  console.log(err.name, err);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySql Connected...');
});

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

app.get('/createdb', (req, res) => {
  let sql = 'CREATE DATABASE nodemysql';
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log('error connecting to db: ', result);
    res.send('Database created...');
  });
});

// Promise rejections (outside of the app)
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
