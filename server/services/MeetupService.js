class MeetupService {
  db = null

  constructor(database) {
    this.db = database;
  }

  async createMeetup({
    topic, date, place, image
  }) {
    const { rows: [newMeetup] } = await this.db.queryDb({
      text: `INSERT INTO Meetup (topic, location, happeningOn, images)
               VALUES ($1, $2, $3, $4) RETURNING id, topic, location, happeningOn, images`,
      values: [topic, place, date, [image]]
    });
    return newMeetup;
  }

  async getMeetups({ filter, take, orderBy = 'happeningOn' }) {
    const allMeetupsSQLStatement = `
      SELECT id, topic, location, happeningOn as "happeningOn" FROM Meetup
      ORDER BY $1 DESC
      LIMIT $2;
    `;

    const filterMeetupSQLStatement = `
      SELECT id, topic, location, happeningOn as "happeningOn", tags FROM Meetup 
      WHERE LOWER(topic) LIKE LOWER($1) OR LOWER(location) LIKE LOWER($2)
      ORDER BY $3 DESC
      LIMIT $4;
    `;

    if (filter) {
      const { rows } = await this.db.queryDb({
        text: filterMeetupSQLStatement,
        values: [`%${filter}%`, `%${filter}%`, orderBy, take]
      });
      return rows;
    }

    const { rows } = await this.db.queryDb({
      text: allMeetupsSQLStatement,
      values: [orderBy, take]
    });

    return rows;
  }
}

export default MeetupService;
