const router = require('express').Router();
const { getUser, updateUser } = require('../controllers/users');
const { validateUserProfile } = require('../middlewares/validation');

router.get('/me', getUser);
router.patch('/me', validateUserProfile, updateUser);

module.exports = router;
