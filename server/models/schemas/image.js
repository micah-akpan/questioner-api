export default {
  text: `CREATE TABLE IF NOT EXISTS Image (
      id SERIAL PRIMARY KEY,
      imageUrl TEXT NOT NULL,
      meetup INTEGER NOT  NULL REFERENCES Meetup ON DELETE CASCADE
  )`
};
