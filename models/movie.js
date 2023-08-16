const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'поле "country" не заполнено'],
  },
  director: {
    type: String,
    required: [true, 'поле "director" не заполнено'],
  },
  duration: {
    type: Number,
    required: [true, 'поле "duration" не заполнено'],
  },
  year: {
    type: String,
    required: [true, 'поле "year" не заполнено'],
  },
  description: {
    type: String,
    required: [true, 'поле "description" не заполнено'],
  },
  image: {
    type: String,
    required: [true, 'поле "image" не заполнено'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Неверный формат ссылки на изображение',
    },
  },
  trailer: {
    type: String,
    required: [true, 'поле "trailerLink" не заполнено'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Неверный формат ссылки на трейлер',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'поле "thumbnail" не заполнено'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Неверный формат ссылки на изображение',
    },
  },
  owner: {
    type: mongoose.Types.ObjectId,
    required: [true, 'поле "owner" не заполнено'],
  },
  movieId: {
    type: Number,
    required: [true, 'поле "movieId" не заполнено'],
  },
  nameRU: {
    type: String,
    required: [true, 'поле "nameRU" не заполнено'],
  },
  nameEN: {
    type: String,
    required: [true, 'поле "nameEN" не заполнено'],
  },
});

module.exports = mongoose.model('movie', movieSchema);
