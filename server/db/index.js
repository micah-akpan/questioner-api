import { Pool } from 'pg';
import dbConfig from '../models/config';
import Db from './Db';

const connInfo = dbConfig[process.env.NODE_ENV || 'development'];

const pool = new Pool(connInfo);

export default new Db(pool);
