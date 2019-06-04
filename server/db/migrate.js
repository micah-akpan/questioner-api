import dbClient from '.';
import tableQueries from '../models/schemas';
import data from '../seed';
import wLogger from '../helpers/index';

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
    return Promise.resolve('Data Migration was successful');
  } catch (ex) {
    wLogger.log({
      level: 'error',
      message: ex.toString()
    })
  }
}

migrate()
  .then(result => {
    wLogger.log({
      level: 'info',
      message: result
    });
    process.exit(0);
  })
  .catch((ex) => {
    wLogger.log({
      level: 'error',
      message: ex.toString()
    })
  });
