import express from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import { config } from 'dotenv';
import meetupAPI from './routes/meetup';
import questionAPI from './routes/question';
import rsvpAPI from './routes/rsvp';
import indexAPI from './routes';
import dbQuery from './data/models';

config();

// This initializes all data tables
// dbQuery.createTable(dbQuery.tableQueries.meetup);
// dbQuery.createTable(dbQuery.tableQueries.user);
// dbQuery.createTable(dbQuery.tableQueries.question);
// dbQuery.createTable(dbQuery.tableQueries.rsvp);

dbQuery.createTables();

export const app = express();

app.set('json spaces', 2);

/* Middlewares */
if (app.get('env') === 'development') {
  app.use(logger('dev'));
}

app.use(helmet());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', indexAPI);
app.use('/api/v1', meetupAPI);
app.use('/api/v1', questionAPI);
app.use('/api/v1', rsvpAPI);

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
