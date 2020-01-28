const router = require('express').Router();
const checkToken = require('../../middleware/checkToken');
const userController = require('./UserController');

router.get('/', checkToken, userController.showCurrent);
router.get('/user/:id', checkToken, userController.showUser);
router.get('/search/:query', checkToken , userController.searchUsers);
router.put('/update', checkToken, userController.update);

export default router;