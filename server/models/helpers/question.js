export default {
  text: `CREATE TABLE IF NOT EXISTS Question (
      id SERIAL PRIMARY KEY,
      title text NOT NULL,
      body text NOT NULL,
      createdBy INTEGER NOT NULL REFERENCES Users,
      meetup INTEGER NOT NULL REFERENCES Meetup,
      votes INTEGER DEFAULT 0 CONSTRAINT positive_votes CHECK (votes >= 0),
      createdOn DATE DEFAULT NOW()
    )`
};
