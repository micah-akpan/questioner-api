import jwt from 'jsonwebtoken';
/**
 * @func omitProps
 * @param {Object} obj
 * @param {Array<String>} propsToOmit
 * @param {Boolean} caseInsensitive
 * @return {Object} A new object with some props omitted
 * @description Takes an object, omits some props from the object and returns a new object
 */
export const omitProps = (obj, propsToOmit, caseInsensitive = true) => {
  const newObject = {};
  const objKeys = Object.keys(obj);

  let newPropsToOmit = [];
  if (caseInsensitive) {
    newPropsToOmit = propsToOmit.map(props => props.toLowerCase());
  } else {
    newPropsToOmit = propsToOmit;
  }

  for (const prop of objKeys) {
    if (!newPropsToOmit.includes(prop.toLowerCase())) {
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
 * @func createTestToken
 * @param {Boolean} admin
 * @returns {String} Jwt token
 */
export const createTestToken = (admin = false) => jwt.sign({
  email: 'testuser@email.com', admin
}, process.env.JWT_SECRET, {
  expiresIn: '24h'
});

/**
 * @func arrayHasValues
 * @param {Array} array
 * @returns {Boolean} Returns true if array has values, false otherwise
 */
export const arrayHasValues = array => array.length > 0;

/**
 * @func objectHasProps
 * @param {*} obj
 * @returns {Boolean} Returns true if object has props, false otherwise
 */
export const objectHasProps = obj => Object.keys(obj).length > 0;

/**
 * @func parseStr
 * @param {String} str
 * @param {String} separator Separator string, by default uses a space
 * @returns {Array<String>} Returns an array of strings
 * @description Takes a str delimited by 'separator' and returns an array of strings
 */
export const parseStr = (str, separator = ' ') => str.split(separator);

export default {
  omitProps,
  getFutureDate,
  isBoolean,
  hasProp,
  getProp,
  getIndex,
  createTestToken,
  parseStr
};
