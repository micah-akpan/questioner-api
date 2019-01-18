export default {
  allowOnly(allowedValues) {
    return (req, res, next) => {
      const { response } = req.body;
      if (!(allowedValues.includes(response))) {
        return res
          .status(422)
          .send({
            status: 422,
            error: 'response can only be one of yes, no or maybe'
          });
      }
      next();
    };
  },

  trimBody(req, res, next) {
    const keys = Object.keys(req.body);
    const newRequestBody = {};
    keys.forEach((k) => {
      if (typeof req.body[k] === 'string') {
        newRequestBody[k] = req.body[k].trim();
      } else if (Array.isArray(req.body[k])) {
        const array = req.body[k];
        const newArray = array.map(value => value.trim());
        newRequestBody[k] = newArray;
      }
    });

    req.body = newRequestBody;
    next();
  },

  checkParams(req, res, next) {
    const strs = Object.keys(req.params);
    const MAX_INT_POS = 2147483647; // maximum value an integer database type can contain
    strs.forEach((s) => {
      if (Number(req.params[s]) > MAX_INT_POS) {
        return res.status(422)
          .send({
            status: 422,
            error: `Params cannot be a value greater than ${MAX_INT_POS}`
          });
      }
      const param = parseInt(req.params[s], 10);
      if (Number.isNaN(param)) {
        return res
          .status(422)
          .send({
            status: 422,
            error: 'Params must be a number'
          });
      }

      if (param < 0 || param === 0) {
        return res
          .status(422)
          .send({
            status: 422,
            error: 'Params cannot be negative or zero'
          });
      }
    });

    next();
  },


};
