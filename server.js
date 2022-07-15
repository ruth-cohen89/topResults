const dotenv = require('dotenv');
const app = require('./app');

// Synchronous exeptions on the app
// process.on('uncaughtException', (err) => {
//   console.log('UNCAUGHT EXCEPTION! ⛔ Shutting down...');
//   console.log(err.name, err);
//   process.exit(1);
// });

dotenv.config({ path: './config.env' });
const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Promise rejections (outside of the app)
// process.on('unhandledRejection', (err) => {
//   console.log('UNHANDLED REJECTION! 💥 Shutting down...');
//   console.log(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });
