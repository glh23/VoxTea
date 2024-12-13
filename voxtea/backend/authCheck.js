const jwt = require('jsonwebtoken');


// Change to .env in production
const JWT_SECRET = 'qwertyuiopasdfghjklzxcvbnm'; 


const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token
    if (!token || token === null) {
        return res.status(401).json({ message: 'Token missing' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET );
        req.user = decoded; // Attach the user info to the request
        next();
    } catch (err) {
        console.log(err);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = verifyToken;
