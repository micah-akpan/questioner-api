import { Pool } from 'pg';
import dbConfig from '../models/config';

const connInfo = dbConfig[process.env.NODE_ENV || 'development'];

const pool = new Pool(connInfo);

/**
 * @module dbQueryInterface
 */
export default {
  /**
   * @param {*} query An object with 2 required fields (text and values)
   * @returns {Promise<QueryResult>} Returns a promise of the results of the query operation
   */
  queryDb: query => pool.query(query)
};
