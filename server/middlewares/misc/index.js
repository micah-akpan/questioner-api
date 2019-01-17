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
      newRequestBody[k] = req.body[k].trim();
    });

    req.body = newRequestBody;
    next();
  }
};
