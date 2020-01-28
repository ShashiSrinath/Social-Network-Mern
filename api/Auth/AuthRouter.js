const router = require('express').Router();
const authController = require('./AuthController');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;