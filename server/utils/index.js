
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

export default {
  omitProps
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
