const express = require('express');

const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const config = require('config');
const { check, validationResult } = require('express-validator');
const router = express.Router();


const User = require('../../modals/User');

// @route Get api/users
// @description Test route
// @access Public 
//router.get('/', (req,res) => res.send('User route'));

router.post('/', [
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
        'password',
        'Please enter a password with 6 or more character')
        .isLength({ min: 4 })
],
    async (req, res) => {
        console.log(req.body);
        const errors = validationResult(req);  //handling errors
        if (!errors.isEmpty()) {
            // error cha
            return res.status(400).json({ errors: errors.array() })
        }

        const { name, email, password } = req.body;
        //See if user exists
        try {
            let user = await User.findOne({ email });
            if (user) {
                res.status(400).json({ errors: [{ msg: 'User already exists' }] })
            }
            // Get url of users gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })

            user = new User({
                name,
                email,
                password

            });

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();

            //Encrypt password

            //Return jsonswebtoken
            const payload = {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            }

            jwt.sign(  //jwt signature
                payload,
                config.get('jwtToken'), //getting secret key
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token, user });

                });

        } catch (err) {
            console.error(err.message);
            res.status(500).send('SERVER ERROR');

        }

    })

module.exports = router;