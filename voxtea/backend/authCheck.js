const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; 

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    // Extract the token
    const token = authHeader.split(' ')[1]; 
    if (!token || token === null) {
        return res.status(401).json({ message: 'Token missing' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET );
        // Attach the user info to the request
        req.user = decoded; 
        next();
    } catch (err) {
        console.log(err);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = verifyToken;
