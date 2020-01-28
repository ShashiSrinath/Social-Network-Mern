const Comment = require('./CommentSchema');
const Post = require('../Post/PostSchema');
const validateComment = require('./validation/validateComment');

//GET get comments by post
const getComments = async (req, res) => {
    try {
        //find the post
        const post = await Post.findById(req.params.id);

        //load comments
        const comments = await Comment.find({post: post._id}).populate('user', ['username', 'name', 'avatar']);

        //return comments
        return res.json({status: 200, message: 'success', comments})
    } catch (err) {
        res.status(404).json({status: 404, message: 'post not found'})
    }
};

//POST add comment
const addComment = async (req, res) => {
    try {
        //find the post
        const post = await Post.findById(req.params.id);

        //validate form data
        const {errors, notValid} = validateComment(req.body);

        if (notValid) {
            return res.status(400).json({status: 400, errors});
        }

        //create comment
        const newComment = {
            user: req.user._id,
            post: post._id,
            content: req.body.content
        };
        const comment = await Comment.create(newComment);

        //add comment to post
        post.comments.push(comment._id);
        try {
            //save post
            await post.save();

            //load comments
            const comments = await Comment.find({post: post._id}).populate('user', ['username', 'name', 'avatar']);

            //return comments
            return res.json({status: 200, message: 'success', comments})
        } catch (err) {
            console.error(err);
            res.status(500).json({status: 500, message: 'internal server error'});
        }
    } catch (err) {
        res.status(404).json({status: 404, message: 'post not found'})
    }
};

//PUT edit comment
const editComment = async (req, res) => {
    try {
        //validate form data
        if (!req.body.content || req.body.content === '') {
            return res.status(400).json({status: 400, message: 'Comment cannot be empty'});
        }

        //find the comment
        const comment = await Comment.findById(req.params.id);

        //check to see if the user owns the comment or not
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                status: 403,
                message: 'you dont have permission to edit this comment'
            });
        }

        //add comment data
        comment.content = req.body.content;
        try {
            //save comment
            await comment.save();

            //return comment
            return res.json({status: 200, message: 'success', comment})
        } catch (err) {
            console.error(err);
            res.status(500).json({status: 500, message: 'internal server error'});
        }
    } catch (err) {
        res.status(404).json({status: 404, message: 'comment not found'})
    }
};

//DELETE delete comment
const deleteComment = async (req, res) => {
    try {
        //find the comment
        const comment = await Comment.findById(req.params.id);

        //check to see if the user owns the comment or not
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                status: 403,
                message: 'you dont have permission to edit this comment'
            });
        }

        try {
            //delete comment
            const deletedComment = await comment.delete();

            // remove comment from post
            await Post.update({},
                {$pull: {comments: deletedComment._id}},
                {multi: false});

            //return
            return res.json({status: 200, message: 'success', deletedComment})
        } catch (err) {
            console.error(err);
            res.status(500).json({status: 500, message: 'internal server error'});
        }
    } catch (err) {
        res.status(404).json({status: 404, message: 'comment not found'})
    }
};

module.exports = {addComment, getComments, editComment, deleteComment};
