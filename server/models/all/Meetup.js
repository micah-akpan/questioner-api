import Model from './Model';
import db from '../../db';
/**
 * @class Meetup
 * @description Meetup Model
 */
class Meetup extends Model {
  /**
     * @constructor
     */
  constructor() {
    super('Meetup', db);
  }
}

export default new Meetup();
