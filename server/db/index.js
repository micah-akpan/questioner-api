const { Pool } = require('pg');

const { DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const connInfo = {
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME
};

const pool = new Pool(connInfo);

export default {
  queryDb: query => pool.query(query)
};
