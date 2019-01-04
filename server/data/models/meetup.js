const sqlQuery = {
  text: `CREATE TABLE IF NOT EXISTS Meetup (
      id SERIAL NOT NULL PRIMARY KEY,
      topic text NOT NULL,
      location text NOT NULL,
      happeningOn TIMESTAMP NOT NULL,
      createdOn DATE DEFAULT NOW(),
      images ARRAY,
      tags ARRAY
    )`
};


export default {
  sqlQuery
};
