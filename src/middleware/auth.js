const jwt = require('jsonwebtoken');

require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.headers['Authorization']?.split(' ')[-1];
    if(!token){
        return res.status(401).send('Token is required for this action');
    }
    try{
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = decoded;
    } catch(err){
        return res.status(401).send('Invalid token');
    }
    return next();
}

module.exports = verifyToken;
