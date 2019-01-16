export default {
  text: `CREATE TABLE IF NOT EXISTS Comment (
      id SERIAL PRIMARY KEY,
      body text NOT NULL,
      question INTEGER NOT NULL REFERENCES Question ON DELETE CASCADE,
      createdOn DATE DEFAULT NOW()
    )`
};
