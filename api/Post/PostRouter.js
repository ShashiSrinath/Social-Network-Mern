const router = require('express').Router();
const checkToken = require('../../middleware/checkToken');
const postController = require('./PostController');

router.get('/' , postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.get('/user/:id', postController.getPostsByUser);
router.post('/create', checkToken , postController.createPost);
router.put('/update/:id' , checkToken ,postController.updatePost);
router.delete('/delete/:id' , checkToken ,postController.deletePost);

router.post('/like/:id' , checkToken , postController.likePost);
router.post('/unlike/:id' , checkToken , postController.unlikePost);

module.exports = router;
