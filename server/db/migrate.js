import dbClient from '.';
import tableQueries from '../models/schemas';
import data from '../seed';

/* eslint-disable */
const migrate = async () => {
  try {
    const tableNames = Object.keys(tableQueries);
    for (let tableName of tableNames) {
      // bulk drop
      if (tableName === 'User') {
        await dbClient.dropTable({ tableName: '"User"' })
      } else {
        await dbClient.dropTable({ tableName })
      }
    }
    // sync tables
    await dbClient.sync();
    // seed
    for (let table of Object.keys(data)) {
      await dbClient.bulkInsert(table, data[table])
    }
  } catch (ex) {
    console.log(ex);
  }
}

migrate()
  .then(result => {
    console.log(result)
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
  });