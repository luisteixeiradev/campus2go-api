const jwt = require('jsonwebtoken');
const { getUserFromToken } = require('../utils/token');

exports.auth = async (req, res, next) => {

    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.type !== 'auth') {
            return res.status(401).json({ error: 'Invalid token type' });
        }
        
        req.user = await getUserFromToken(token);
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }

}