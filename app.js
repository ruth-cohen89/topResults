const express = require('express');

const path = require('path');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');

const app = express();

// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// TODO: test it
app.use(compression());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api', (req, res, next) => {
  res.status(200).json({
    status: 'success',
    results: foods.length,
    data: {
      data: 'Welcome to <NAME_OF_PROJECT> API',
    },
  });
});

app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server 🙄`, 404));
}); 

app.use(globalErrorHandler);
module.exports = app;
