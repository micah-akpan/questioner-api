const sqlQuery = {
  text: `CREATE TABLE IF NOT EXISTS User (
      id SERIAL NOT NULL PRIMARY KEY,
      firstname text NOT NULL,
      lastname text NOT NULL,
      othername text,
      email text NOT NULL,
      phoneNumber INTEGER NOT NULL,
      username text NOT NULL,
      registered boolean DEFAULT FALSE,
      isAdmin boolean DEFAULT FALSE
    )`
};

export default {
  sqlQuery
};
