// src/middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                error: 'Authentication required',
                message: 'No token provided'
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ 
                error: 'Invalid token',
                message: 'Token verification failed'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: 'Authentication process failed'
        });
    }
};

module.exports = authMiddleware;