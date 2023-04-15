const Movie = require('../models/movie');
const NotFoundError = require('../errors/notFoundError');
const NoRightsError = require('../errors/noRightsError');
const ValidationError = require('../errors/validationError');
const UserExistError = require('../errors/userExistError');

const {
  SUCCESS,
} = require('../errors/constants');

const getUserMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });
    const mappedMovies = movies.map((movie) => movie);
    return res.status(SUCCESS).send(mappedMovies);
  } catch (err) {
    return next(err);
  }
};

const createMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
    } = req.body;
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner: req.user._id,
    });
    const populatedMovie = await Movie.findById(movie._id);
    return res.status(SUCCESS).json(populatedMovie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
    }
    if (err.name === 'MongoError' && err.code === 11000) {
      next(new UserExistError('Фильм уже сохранен в избранном'));
    }
    return next(err);
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.movieId).orFail(new NotFoundError('Фильм не найден'));
    if (!movie.owner.equals(req.user._id)) {
      throw new NoRightsError('Нет прав для удаления');
    }
    await Movie.deleteOne({ _id: movie._id });
    res.send({ message: 'Фильм удален' });
  } catch (err) {
    if (err.name === 'CastError') {
      throw new ValidationError('Переданы некорректные данные id фильма');
    } else {
      next(err);
    }
  }
};

module.exports = {
  getUserMovies,
  createMovie,
  deleteMovie,
};
