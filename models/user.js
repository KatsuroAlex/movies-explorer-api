const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AuthError = require('../errors/authError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'email не указан'],
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Неверный формат почты',
    },
  },
  password: {
    type: String,
    required: [true, 'пароль не указан'],
    select: false,
    minlength: [4, 'пароль не может быть короче четырех символов'],
  },
  name: {
    type: String,
    required: [true, 'имя не указано'],
    minlength: [2, 'имя пользователя не может быть короче двух символов'],
  },
});

// удаляем из документа пользователя поле password
userSchema.methods.toJSON = function noShowPassword() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.statics.findUserByCredentials = function getUserAuth(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError('Введен неправильный логин или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthError('Введен неправильный логин или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
