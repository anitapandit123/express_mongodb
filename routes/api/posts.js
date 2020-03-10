
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

const auth = require('../../middleware/auth');
const Post = require('../../modals/Profiles');
const User = require('../../modals/User');

router.post('/', [auth, [check('text', 'Text is required').not().isEmpty()]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).select('-password');

            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.is
            });

            const post = await newPost.save();
            res.json(post);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }

    }
);

//@route GET api/posts
//@desc Get all posts
//@access Private

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('SERVER ERROR');
    }
});

//@route get posts by id api/posts/:id
//@desc Get post by Id
//@access private

router.get('/:id', auth, async (req, res) => {
    try {

        const idFromReq = req.params.id
        const post = await Post.findById(idFromReq);

        // check for Objectid format and post
        if (!idFromReq.match(/^[0-9a-fA-F]{24}$/) || !post) {
            return res.status(404).json({ msg: 'Post not found' })
        }

        res.json(post);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('SERVER ERROR')
    }
});

//@route DELETE api/posts/:id
//@desc DELETE A POST
// @access Private

router.delete('/:id', auth, async (req, res) => {

    try {
        const reqId = req.params.id
        const toBedeletedPost = await Post.findById(reqId);

        // Check for objectId format and post

        if (!reqId.match(/^[0-9a-fA-F]{24}$/) || !toBedeletedPost) {
            return res.status(401).json({ msg: "Post not found" });
        }
        //Check User
        if (toBedeletedPost.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await toBedeletedPost.remove();
        res.json({ msg: 'Post Removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('SERVER ERROR')
    }
});

//@route PUT api/posts/like/:id
//@desc Like a post
//@ccess Private

router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //Check if the post has already been liked
        const userId = req.uer.id
        if (
            post.likes.filter(like => like.user.toString() === userId).length > 0
        ) {
            return res.status(400).json({ msg: 'Post already liked' });
        }

        post.likes.unshift({ user: req.user.id });

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('SERVER ERROR');
    }
});

//@ Post api/posts/unlike/:id
//@desc Unlike a post
//@access Private

router.put('unlike/:id', auth, async (req, res) => {
    try {
        const reqParamId = req.params.id;
        const post = await Post.findById(reqParamId);

        //Check if the post has been aalready been liked
        if (post.likes.filter(like.user.toString() === req.user.id).length === 0) {

            return res.status(400).json({ msg: 'Post has not been liked yet' });
        }

        //Get remove index
        // if post has been liked and we need to unlike it
        const removeIndex = post.likes
            .map(like => like.user.toString())
            .indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);
        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message)
        res.status(500).send('SERVER ERROR');
    }
});






module.exports = router;