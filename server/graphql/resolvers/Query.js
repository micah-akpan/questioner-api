export default {
  async meetups(_, {
    filter, take = 5, orderBy = 'happeningOn'
  }, { db }) {
    if (!filter) {
      const { rows } = await db.queryDb({
        text: `
                SELECT id, topic, location, happeningOn as "happeningOn", tags FROM Meetup
                ORDER BY $1 DESC
                LIMIT $2;
              `,
        values: [orderBy, take]
      });
      return rows;
    }

    const { rows } = await db.queryDb({
      text: `
            SELECT id, topic, location, happeningOn as "happeningOn", tags FROM Meetup 
            WHERE LOWER(topic) LIKE LOWER($1) OR LOWER(location) LIKE LOWER($2)
            ORDER BY $3 DESC
            LIMIT $4;
          `,
      values: [`%${filter}%`, `%${filter}%`, orderBy, take]
    });

    return rows;
  },

  async questions(_, _args, { db }) {
    const { rows } = await db.queryDb({
      text: 'SELECT id, title, body, meetup, votes, createdby as user, createdon as "createdOn" FROM Question ORDER BY votes DESC'
    });
    return rows;
  }
};
