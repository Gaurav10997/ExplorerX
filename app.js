const express = require(`express`);
const morgan = require('morgan');
const AppError = require('./utils/appError')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes')
const globalErrorHandler = require('./controllers/errorController')
const cors = require('cors')


const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews' , reviewRouter);


app.all('*',( req, res, next) => {
 
 next(new AppError(`cant find the ${req.originalUrl} on this server`,404));
})


// global error handling  mechanism 
app.use(globalErrorHandler)
module.exports = app;
