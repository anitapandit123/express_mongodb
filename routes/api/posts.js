
const router = express.Router();
const { cheeck, validationResult } = require('express-validator/check');

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
            console.log(err.message);
            res.status(500).send('Server Error');
        }


    }
)

module.exports = router;