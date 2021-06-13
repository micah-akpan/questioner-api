import dbClient from '.';
import wLogger from '../helpers';
import data from '../seed';

(async () => {
  try {
    for (const table of Object.keys(data)) {
      dbClient.bulkInsert(table, data[table]);
    }

    wLogger.log({
      level: 'info',
      message: 'All tables have been seeded'
    });
    process.exit(0);
  } catch (err) {
    wLogger.error(err);
  }
})();
