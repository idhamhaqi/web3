// src/middleware/session.js
import jwt from 'jsonwebtoken';

const checkSession = (req, res, next) => {
    const token = req.cookies.auth_token || req.headers.authorization?.split(' ')[1];
   
    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid session' });
    }
};

export default checkSession;