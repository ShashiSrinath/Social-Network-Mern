const Post = require('./PostSchema');
const Comment = require('../Comment/CommentSchema');
const validatePost = require('./validation/validatePost');
const fs = require('fs');
const path = require('path');

// GET Read all posts route
const getAllPosts = async (req, res) => {
    try {
        //find posts
        const posts = await Post.find()
            .sort({created_date: -1})
            .populate('user', ['username','name','avatar']);

        //check to see if there are no posts
        if (!posts) return res.json({status: 200, message: 'success', posts: []});

        //return posts
        await res.json({status: 200, message: 'success', posts});

    } catch (err) {
        console.error(err);
        res.status(500).json({status: 500, message: 'internal server error'})
    }
};

// GET get post by id
const getPostById = async (req, res) => {
    try {
        //find the post
        const post = await Post.findById(req.params.id)
            .populate('user', ['username','name','avatar']);

        //check to see if post exists or not
        if (!post) return res.status(404).json({status: 404, message: 'post not found'});

        //return post
        await res.json({status: 200, message: 'success', post});
    } catch (err) {
        res.status(404).json({status: 404, message: 'post not found'})
    }
};

// GET get Posts of the user
const getPostsByUser = async (req, res) => {
    try {
        //find posts
        const posts = await Post.find({user: req.params.id})
            .sort({created_date: -1})
            .populate('user', ['username','name','avatar']);

        //check to see if there are no posts
        if (!posts) return res.json({status: 200, message: 'success', posts});

        //return posts
        await res.json({status: 200, message: 'success', posts});
    } catch (err) {
        res.status(404).json({status: 404, message: 'user not found'})
    }
};

// POST Create post route
const createPost = async (req, res) => {
    //validate form data
    const {errors, notValid} = validatePost(req.body);
    if (notValid) {
        return res.status(400).json({status: 400, message: errors});
    }

    //check the updated image file
    const fileName = path.basename(req.body.image);
    const fileExists = await fs.existsSync(`${__dirname}/../uploads/tmp/${fileName}`);
    if (!fileExists) return res.status(400).json({status: 400, message: "Please upload a image"});

    //move image to the /uploads/posts folder
    await fs.renameSync(`${__dirname}/../uploads/tmp/${fileName}`, `${__dirname}/../uploads/posts/${fileName}`);
    const imageDir = `uploads/posts/${fileName}`;

    //creating new post
    const newPost = {
        user: req.user._id,
        content: req.body.content,
        image: imageDir
    };
    try {
        const savedPost = await Post.create(newPost);
        res.status(200).json({status: 200, message: 'success', post: savedPost});
    } catch (err) {
        console.log(err);
        return res.status(500).json({status: 500, message: "internal server error"});
    }
};

// DELETE Delete post route
const deletePost = async (req, res) => {
    try {
        //find the post
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({status: 404, message: 'post not found'});

        //check the owner of the post
        if (post.user.toString() !== req.user._id.toString()) return res.status(403).json({
            status: 403,
            message: 'you dont have permission to delete this post'
        });

        //delete the post
        try {
            const deletedPost = await post.delete();

            //delete post comments
            await Comment.deleteMany({post: deletedPost._id});

            //delete post image
            fs.unlink(deletedPost.image, (err) => {
                console.log(err);
            });

            await res.json({status: 200, message: 'success'})
        } catch (err) {
            console.error(err);
            res.status(500).json({status: 500, message: 'internal server error'})
        }
    } catch (err) {
        //incase someone enter a false id
        return res.status(404).json({status: 404, message: 'post not found'});
    }
};

// PUT Update post route
const updatePost = async (req, res) => {
    //validate form data
    const {errors, notValid} = validatePost(req.body);
    if (notValid && errors[0].type === 'content') {
        return res.status(400).json({status: 400, message: errors[0].message});
    }

    try {
        //find the post
        const post = await Post.findById(req.params.id)
            .populate('user', ['username']);

        //check to see if post is exists or not
        if (!post) return res.status(404).json({status: 404, message: 'post not found'});

        //check the owner of the post
        if (post.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                status: 403,
                message: 'you dont have permission to edit this post'
            });
        }

        //add post data
        post.content = req.body.content;
        post.last_update = Date.now();

        try {
            //save the post
            const savedPost = await post.save();
            await res.json({status: 200, message: 'success', post: savedPost})
        } catch (err) {
            console.error(err);
            res.status(500).json({status: 500, message: 'internal server error'})
        }
    } catch (err) {
        //incase someone enter a false id
        return res.status(404).json({status: 404, message: 'post not found'});
    }
};

//POST like post
const likePost = async (req, res) => {
    try {
        //find the post
        const post = await Post.findById(req.params.id);

        //check to see if user already like the post or not
        const likedUsers = post.likes.map(like => like.user);
        if (likedUsers.includes(req.user._id.toString())) {
            return res.status(400).json({status: 400, message: 'already liked'});
        }

        //create a like object
        const currentLike = {user: req.user._id};

        //add like to the post
        post.likes.push(currentLike);

        try {
            //save the post
            await post.save();
            await res.json({status: 200, message: 'success', likes: post.likes})
        } catch (err) {
            console.error(err);
            res.status(500).json({status: 500, message: 'internal server error'})
        }
    } catch (err) {
        res.status(404).json({status: 404, message: 'post not found'})
    }
};


//POST unlike post
const unlikePost = async (req, res) => {
    try {
        //find the post
        const post = await Post.findById(req.params.id);

        //check to see if user already like the post or not
        let likedIndex = undefined;
        for (let i = 0; i < post.likes.length; i++) {
            if (post.likes[i].user.toString() === req.user._id.toString()) likedIndex = i;
        }
        if (likedIndex === undefined) return res.status(400).json({
            status: 400,
            message: 'user didn\'t like the post previously'
        });

        //remove like from post
        post.likes.splice(likedIndex, 1);

        try {
            //save the post
            const savedPost = await post.save();
            await res.json({status: 200, message: 'success', likes: savedPost.likes})
        } catch (err) {
            console.error(err);
            res.status(500).json({status: 500, message: 'internal server error'})
        }
    } catch (err) {
        res.status(404).json({status: 404, message: 'post not found'})
    }
};

module.exports = {
    getAllPosts,
    getPostById,
    getPostsByUser,
    createPost,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
};
