import Model from './Model';
import db from '../../db';
/**
 * @class Image
 * @description Image Model to interface with Image Table
 */
class Image extends Model {
  /**
   * @constructor
   */
  constructor() {
    super('Image', db);
  }
}

export default new Image();
