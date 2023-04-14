const { NODE_ENV, JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');
// const { JWT_SECRET } = require('../config');
const AuthError = require('../errors/authError');

const auth = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new AuthError('Токен остутствует или некорректен'));
  }

  let payload;
  try {
    // payload = jwt.verify(token, JWT_SECRET);
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    next(new AuthError('Токен не верифицирован, авторизация не пройдена'));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
