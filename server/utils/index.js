export const omitProps = (obj, propsToOmit) => {
  const newObject = {};
  const objKeys = Object.keys(obj);

  /* eslint-disable */
  for (let prop of objKeys) {
    if (!propsToOmit.includes(prop)) {
      newObject[prop] = obj[prop];
    }
  }

  return newObject;
}

export default {
  omitProps
}

