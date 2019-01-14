import jwt from 'jsonwebtoken';

export default {
  checkToken(req, res, next) {
    let token = req.get('authorization') || req.get('access-token');

    if (token) {
      if (token.startsWith('Bearer')) {
        token = token.slice(7);
      }

      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401)
            .send({
              status: 401,
              error: 'Invalid token'
            });
        }

        req.decodedToken = decoded;
        next();
      });
    } else {
      return res.status(400)
        .send({
          status: 400,
          error: 'Auth Token is not provided'
        });
    }
  },

  isAdmin(req, res, next) {
    if (!req.decodedToken.admin) {
      return res.status(403)
        .send({
          status: 403,
          error: 'Only admins can create or delete a meetup'
        });
    }

    next();
  }
};
