const router = require('express').Router();
const checkToken = require('../../middleware/checkToken');
const commentController = require('./CommentController');

router.post('/:id' , checkToken , commentController.addComment);
router.get('/:id' , checkToken , commentController.getComments);
router.put('/edit/:id' , checkToken , commentController.editComment);
router.delete('/delete/:id' , checkToken , commentController.deleteComment);



module.exports = router;
