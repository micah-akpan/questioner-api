export default {
  text: `CREATE TABLE IF NOT EXISTS Rsvp (
      id SERIAL NOT NULL PRIMARY KEY,
      users INTEGER NOT NULL REFERENCES Users,
      meetup INTEGER NOT NULL REFERENCES Meetup,
      response text NOT NULL
    )`
};
