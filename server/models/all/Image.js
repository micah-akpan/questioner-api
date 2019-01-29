import Model from './Model';

/**
 * @class Image
 * @description Image Model to interface with Image Table
 */
class Image extends Model {
  /**
   * @constructor
   */
  constructor() {
    super('Image');
  }
}

export default new Image();
