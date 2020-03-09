const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    //check if there is no token
    if (!token) {
        return res.status(401).json({ msg: 'authorization denied,there is no token saved' })
    }

    //verify token

    // try {
    //     const decoded = jwt.verify(token, config.get('jwtToken'));
    //     req.user = decoded.user;
    //     next();
    // }
    // Verify token
    try {
        jwt.verify(token, config.get('jwtSecret'), (error, decoded) => {
            if (error) {
                res.status(401).json({ msg: 'Token is not valid' });
            }
            else {
                req.user = decoded.user;
                next();
            }
        });
    }
    // this will run if token is not valid
    catch (err) {
        console.log('something is wrong with middleware')
        res.status(500).json({ msg: 'Token is not valid' })
    }

}