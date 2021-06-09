import express from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { config } from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import { graphqlUploadExpress } from 'graphql-upload';
import fs from 'fs';
import path from 'path';
import wLogger from './helpers';
import indexRouter from './routes';
import db from './db';
import { GRAPHQL_PATH, useGraphqlPlayground } from './config';
import resolvers from './graphql/resolvers';

config();

export const app = express();
app.set('json spaces', 2);

const env = app.get('env');

/* Middlewares */
if (env === 'development' || env === 'production') {
  // sync tables
  db.sync()
    .then((msg) => {
      wLogger.log({
        level: 'info',
        message: msg
      });
    })
    .catch((err) => {
      wLogger.log({
        level: 'error',
        message: err
      });
    });
}

if (env === 'development') {
  app.use(logger('dev'));
}

app.use(cors());
app.use(helmet());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const apolloServer = new ApolloServer({
  context({ req }) {
    return {
      db,
      req,
    };
  },
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'graphql', 'schema.graphql'),
    'utf-8'
  ),
  resolvers,
  playground: useGraphqlPlayground,
  uploads: false // we will be using graphql-upload library for uploading multipart data
});
app.use(graphqlUploadExpress());
apolloServer.applyMiddleware({ app, path: GRAPHQL_PATH });

app.use('/', indexRouter);

// catch 404 error and forward to
// error handler
app.use((req, res, next) => {
  const error = new Error('This Route is Not Available On this server');
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
