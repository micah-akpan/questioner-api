export default {
  text: `CREATE TABLE IF NOT EXISTS Upvote (
      id SERIAL PRIMARY KEY,
      "user" INTEGER NOT  NULL REFERENCES "User",
      question INTEGER NOT NULL REFERENCES Question
  )`
};
