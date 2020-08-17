const jwt = require('jsonwebtoken');
const { check, validationResult }  = require('express-validator/check');

module.exports = {
    ensureAuthenticated: function (req, res, next) {
        try {
            const token = req.headers.authorization;
           // console.log('My auth token',req.headers);
            jwt.verify(token, "secret");
            next();
        }catch (error) {
            console.log('Profile error');
            res.status(401).json({error:"Auth Failed!"})
        }
    },

    emailVerify : (req, res , next) => {

    }
};


