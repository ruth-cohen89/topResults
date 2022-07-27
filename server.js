const dotenv = require('dotenv');
const app = require('./app');

// Synchronous exeptions on the app
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!');
  console.log(err.name, err);
});

dotenv.config({ path: './config.env' });

const PORT = process.env.PORT || 8000;
const server = app.listen('8000', () => {
  console.log(`App running on port ${PORT}...`);
});

// Promise rejections (outside of the app)
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!');
  console.log(err.name, err.message);
});
