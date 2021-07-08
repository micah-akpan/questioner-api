import dbClient from '.';
import tableQueries from '../models/schemas';
import wLogger from '../helpers/index';

/* eslint-disable */
(async () => {
  try {
    const tableNames = Object.keys(tableQueries);
    for (let tableName of tableNames) {
      await dbClient.dropTable({ tableName: tableName === 'User' ? '"User"' : tableName })
    }
    // sync tables
    await dbClient.sync();
    wLogger.log({
      level: 'info',
      message: 'Data migration completed'
    });
    process.exit(0)
  } catch (err) {
    wLogger.log({
      level: 'error',
      message: err
    })
  }
})()
