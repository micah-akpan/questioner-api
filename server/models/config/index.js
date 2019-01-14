/**
 * @module
 * @description different env database configuration
 */
import { config } from 'dotenv';

config();

const {
  DB_USER,
  DB_PASSWORD,
  DB_DEV,
  DB_TEST,
  DB_PROD_USER,
  DB_PROD_PASSWORD,
  DB_PROD
} = process.env;

export default {
  development: {
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DEV,
    host: 'localhost',
    port: 5432,
    pool: 10
  },

  test: {
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_TEST,
    host: 'localhost',
    port: 5432
  },

  production: {
    user: DB_PROD_USER,
    password: DB_PROD_PASSWORD,
    database: DB_PROD,
    host: null,
    port: null
  }
};
