export default {
  text: `CREATE TABLE IF NOT EXISTS Downvote (
      id SERIAL PRIMARY KEY,
      "user" INTEGER NOT  NULL REFERENCES "User",
      question INTEGER NOT NULL REFERENCES Question
  )`
};
