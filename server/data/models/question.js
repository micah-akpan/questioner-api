const sqlQuery = {
  text: `CREATE TABLE IF NOT EXISTS Question (
      id SERIAL NOT NULL PRIMARY KEY,
      title text NOT NULL,
      body text NOT NULL,
      createdBy INTEGER NOT NULL,
      meetup INTEGER NOT NULL,
      votes INTEGER DEFAULT 0,
      createdOn DATE DEFAULT NOW()
    )`
};

export default {
  sqlQuery
};
