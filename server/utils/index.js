
/**
 * @func omitProps
 * @param {Object} obj
 * @param {Array<String>} propsToOmit
 * @return {Object} A new object with some props omitted
 * @description Takes an object, omits some props from the object and returns a new object
 */
export const omitProps = (obj, propsToOmit) => {
  const newObject = {};
  const objKeys = Object.keys(obj);

  for (const prop of objKeys) {
    if (!propsToOmit.includes(prop)) {
      newObject[prop] = obj[prop];
    }
  }

  return newObject;
};

/**
 * @func getFutureDate
 * @param {Number} nDays
 * @return {Date} A future date
 */
export const getFutureDate = (nDays = 1) => {
  const todayInMs = new Date().getTime();
  return new Date(todayInMs + 24 * nDays * 60 * 60 * 1000);
};

/**
 * @func isBoolean
 * @param {*} value
 * @return {Boolean} Returns true if value is a primitive or reference boolean
 */
export const isBoolean = value => typeof value === 'boolean' || value instanceof Boolean;

/**
 * @func hasProp
 * @param {*} object
 * @param {String} prop
 * @return {Boolean} Returns true if 'object' has a property 'prop', false otherwise
 */
export const hasProp = (object, prop) => Object.prototype.hasOwnProperty.call(object, prop);

/**
 * @func getProp
 * @param {*} object
 * @param {String} prop
 * @return {*} The value of object[prop]
 */
export const getProp = (object, prop) => object[prop];

export default {
  omitProps,
  getFutureDate,
  isBoolean,
  hasProp,
  getProp
};
