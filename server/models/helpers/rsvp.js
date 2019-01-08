export default {
  text: `CREATE TABLE IF NOT EXISTS Rsvp (
      id SERIAL NOT NULL PRIMARY KEY,
      "user" INTEGER NOT NULL REFERENCES "User",
      meetup INTEGER NOT NULL REFERENCES Meetup,
      response text NOT NULL
    )`
};
