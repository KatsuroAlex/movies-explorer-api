const { NODE_ENV, JWT_SECRET } = process.env;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const { JWT_SECRET } = require('../config');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const ValidationError = require('../errors/validationError');
const UserExistError = require('../errors/userExistError');
const {
  SUCCESS,
} = require('../errors/constants');

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).orFail(new NotFoundError('Пользователь не найден'));
    return res.send(user);
  } catch (err) {
    return next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const updates = req.body;
    const options = { new: true, runValidators: true };
    const result = await User.findByIdAndUpdate(req.user._id, updates, options).orFail(new NotFoundError('Пользователь по указанному _id не найден'));
    return res.status(SUCCESS).json(result);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
    }
    return next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hash,
    });
    res.status(SUCCESS).json(user);
  } catch (err) {
    if (err.code === 11000) {
      next(new UserExistError('Пользователь c таким email уже существует'));
    } else if (err.name === 'ValidationError') {
      next(new ValidationError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
    } else {
      next(err);
    }
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );
    res
      .cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        // httpOnly: true,
        // secure: 'true',
        // sameSite: 'none',
      })
      .send({ token });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  res.clearCookie('token').send({ message: 'Вы вышли из аккаунта' });
};

module.exports = {
  getUser,
  updateUser,
  createUser,
  login,
  logout,
};
