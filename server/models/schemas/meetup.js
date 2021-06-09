export default {
  text: `CREATE TABLE IF NOT EXISTS Meetup (
      id SERIAL PRIMARY KEY,
      topic text NOT NULL,
      location text NOT NULL,
      happeningOn DATE,
      CHECK (happeningOn >= NOW()),
      createdOn DATE DEFAULT NOW(),
      images text[],
      tags text[],
      maxNumberOfAttendees INTEGER DEFAULT 50
    )`
};
