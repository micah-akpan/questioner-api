import Model from './Model';
import db from '../../db';
/**
 * @class Rsvp
 */
class Rsvp extends Model {
  /**
   * @constructor
   * @param {String} modelName
   */
  constructor() {
    super('Rsvp', db);
  }
}

export default new Rsvp();
