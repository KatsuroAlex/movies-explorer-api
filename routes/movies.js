const router = require('express').Router();
const { getUserMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validateCreateMovie, validateMovie } = require('../middlewares/validation');

router.get('/', getUserMovies);
router.post('/', validateCreateMovie, createMovie);
router.delete('/:movieId', validateMovie, deleteMovie);

module.exports = router;
