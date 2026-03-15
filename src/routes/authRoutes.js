const express = require('express');
const { signup, login } = require('../controllers/authController');
const { validateUserSignup } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post('/signup', validateUserSignup, signup);
router.post('/login', login);

module.exports = router;
