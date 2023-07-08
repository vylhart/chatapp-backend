const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your-secret-key';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log('Authorization header:', authHeader)
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Token:', token)
    if (token == null) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.error('Error verifying token:', err);
            return res.sendStatus(403); // Forbidden
        }
        req.user = user;
        next();
    });
}

function getToken(userId) {
    const token = jwt.sign({userId: userId}, SECRET_KEY, {expiresIn: '6h'});
    console.log('Token:', token)
    return token;
}

module.exports = {authenticateToken, getToken};
