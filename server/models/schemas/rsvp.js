export default {
  text: `CREATE TABLE IF NOT EXISTS Rsvp (
      id SERIAL NOT NULL PRIMARY KEY,
      "user" INTEGER NOT NULL REFERENCES "User" ON DELETE CASCADE,
      meetup INTEGER NOT NULL REFERENCES Meetup ON DELETE CASCADE,
      response text NOT NULL
    )`
};
