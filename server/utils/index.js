
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

/**
 * @func getIndex
 * @param {Array} array
 * @param {String} prop
 * @param {*} value
 * @return {Number} Returns the index of an object in the array
 */
export const getIndex = (array, prop, value) => {
  let idx = -1;

  for (let i = 0; i < array.length; i += 1) {
    const obj = array[i];
    if (obj[prop] === value) {
      idx = i;
    }
  }

  return idx;
};

/**
 * @func getSubset
 * @param {Array} array
 * @param {String} prop
 * @param {*} criteria
 * @param {*} options Option 'castPropValue' if true, will cast prop's value to a string
 * @return {Array} Subset that meets the criteria
 */
export const getSubset = (array, prop, criteria, options = {
  castPropValue: true
}) => {
  if (options.castPropValue) {
    return array.filter(obj => String(obj[prop]) === criteria);
  }

  return array.filter(obj => obj[prop] === criteria);
};

export default {
  omitProps,
  getFutureDate,
  isBoolean,
  hasProp,
  getProp,
  getIndex,
  getSubset
};
