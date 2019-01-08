import express from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import { config } from 'dotenv';
import userAPI from './routes/user';
import indexAPI from './routes';
import questionAPI from './routes/question';
import meetupAPI from './routes/meetup';
import db from './db';

config();

export const app = express();

app.set('json spaces', 2);

/* Middlewares */
if (app.get('env') === 'development') {
  db.sync();
  app.use(logger('dev'));
}

app.use(helmet());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', indexAPI);
app.use('/api/v2/', userAPI);
app.use('/api/v2/', questionAPI);
app.use('/api/v2/', meetupAPI);

// catch 404 error and forward to
// error handler
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Development error handler
// This will print stacktraces

if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
}

// Production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {}
  });
});

export default app;
