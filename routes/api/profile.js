const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profiles = require('../../modals/Profiles');
const User = require('../../modals/User');


// @route GET api/profile/me
// @desc GET current users profile
// @access Private

router.get('/me', auth, async (req, res) => {

    try {
        const profile = await Profiles.findOne({ user: req.user.id }).populate(
            'User',
            ['name', 'avatar']
        );
        if (!profile) {
            return res.status(400).json({ msg: 'there is no profile for this user' });
        }
        res.json(profile);
    }
    catch (err) {

        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


//@route POST api/ 
// @desc Create or update user profile

router.post('/', [auth, [
    check('status', 'Status is required')
        .not()
        .isEmpty(),
    check('skills', 'skills is required')
        .not()
        .isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body

    //Build profile object  
    const profileFields = {};
    profileFields.user = req.user.id;

    if (company) {

        profileFields.company = company;
    }
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    //Build social object
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;


    try {
        let profile = await Profiles.findOne({ user: req.user.id });

        if (profile) {
            //Update
            profile = await Profiles.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );

            return res.json(profile);
        }

        // Create
        newProfileCreate = new Profiles(profileFields); // if we want to update and there is no prifile,,new profile will be created

        await newProfileCreate.save();
        console.log('User Saved')
        res.json(newProfileCreate)

    } catch (err) {
        console.log(err.message);
        res.status(500).send('SERVER ERROR');
    }
}
);


// GET ALL Profiles

router.get('/', async (req, res) => {
    try {
        const profiles = await Profiles.find().populate(
            'user',
            ['name', 'avatar']);
        res.json(profiles);

    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('SERVER ERROR')
    }
});


//Delete Request api/profile
// Delete Profile/user/posts

router.delete('/', auth, async (req, res) => {
    try {

        //Remove profile
        await Profiles.findOneAndRemove({ user: req.user.id });

        //Remove user 
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: 'user deleted' })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// Add profile experience
router.put('/experience',
    [auth, [
        check('title', 'Title is required').not().isEmpty(),
        check('company', 'Company is required').not().notEmpty(),
        check('from', 'From date is required').not().isEmpty()

    ]
    ],
    async (req, res) => {
        const errors = validationResult();
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //destructuring the experice array

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }

        try {
            // lets fetch the profile

            const profile = await Profiles.findOne({ user: req.user.id });

            profile.experince.unshift(newExp);
            profile.save();

            res.json(profile);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')

        }
    }
);



//

module.exports = router;