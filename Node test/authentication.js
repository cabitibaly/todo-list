const {User} = require('./model');
const jwt = require('jsonwebtoken');

const authentication = async (req, res, next) => {
    try {
        const authToken = req.header('Authorization').replace('Bearer ', '');
        const decodedToken = jwt.verify(authToken, 'private');
        const user = await User.findOne({_id: decodedToken._id, 'authTokens.authToken': authToken});
        if(!user) {
            throw new Error('');
        }
        
        req.user = user;
        req.authToken = authToken;
        next();
    } catch(e) {
        res.status(401).send('Please, authenticate yourself !')
    }
}


module.exports = authentication;