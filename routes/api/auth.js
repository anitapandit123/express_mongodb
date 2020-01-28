const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const config = require('config');
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator');

const User = require('../../modals/User');

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//Post 
router.post('/',
    [
        check('email', 'email is required').isEmail(),
        check('password', 'password is required').exists()
    ],


    //checking for errors in the body 
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            if (!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'invalid credentials' }] });
            }


            //password match bcrypt has method called compare(which returns a promise)which takes plain text password and encrypted password and match 

            const isMatch = await bcrypt.compare(password, user.password)


            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }


            const payload = {
                user: {
                    id: user.id,
                    email: user.email,
                    password: user.password
                }
            };

            //signing the token
            jwt.sign(
                payload,
                config.get('jwtToken'),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;

                    const response = { token, user };
                    console.log('res', response);
                    res.json(response);
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('SERVER ERROR')
        }
    }
);
module.exports = router;





