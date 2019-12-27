const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

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
    (req, res) => {
        const errors = validationResult(req);  //handling errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        res.send('user Route')
    })

module.exports = router;