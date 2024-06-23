
const jwt = require('jsonwebtoken');
const SECRET_KEY = '1234567890';

const authenticateToken = (req, res, next) => {
const token = req.headers['authorization'];

if (!token) {
return res.status(401).json({ message: 'Unauthorized Request' });
}

jwt.verify(token, SECRET_KEY, (err, decoded) => {
if (err) {
return res.status(401).json({ message: 'Invalid token' });
}

next();
});
};

module.exports = authenticateToken;