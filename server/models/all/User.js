import Model from './Model';
import db from '../../db';
/**
 * @class User
 */
class User extends Model {
  /**
     * @constructor
     */
  constructor() {
    super('User', db);
  }
}

export default new User();
