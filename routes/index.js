const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const movieRouter = require('./movies');
const { createUser, login, logout } = require('../controllers/users');
const NotFoundError = require('../errors/notFoundError');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) return value;
      return helpers.message('Неверный формат почты');
    }),
    password: Joi.string().required().min(4),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) return value;
      return helpers.message('Неверный формат почты');
    }),
    password: Joi.string().required().min(4),
  }),
}), login);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.post('/signout', logout);
router.use((req, res, next) => {
  next(new NotFoundError(`Запрашиваемый ресурс по адресу '${req.path}' не найден`));
});

module.exports = router;
