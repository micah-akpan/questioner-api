export default {
  text: `CREATE TABLE IF NOT EXISTS Comment (
      id SERIAL PRIMARY KEY,
      body text NOT NULL,
      question INTEGER NOT NULL REFERENCES "Question",
      createdOn DATE DEFAULT NOW()
    )`
};
