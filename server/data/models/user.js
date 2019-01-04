const sqlQuery = {
  text: `CREATE TABLE IF NOT EXISTS User (
      id SERIAL PRIMARY KEY,
      firstname text NOT NULL,
      lastname text NOT NULL,
      othername text,
      email text NOT NULL,
      password text NOT NULL,
      phoneNumber INTEGER NOT NULL,
      username text NOT NULL,
      registered DATE DEFAULT NOW(),
      isAdmin boolean DEFAULT FALSE
    )`
};

export default {
  sqlQuery
};
