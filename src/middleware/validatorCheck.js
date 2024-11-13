// src/middleware/validatorCheck.js
import db from '../config/database.js';  // Jangan lupa .js di akhir

async function validatorCheckMiddleware(req, res, next) {
    try {
        const [user] = await db.query(
            'SELECT validator_status FROM users WHERE id = ?',
            [req.user.id]
        );
        if (!user || !user[0] || !user[0].validator_status) {
            return res.status(403).json({
                error: 'Validator not active',
                message: 'PoC contract has not been signed. Execute it to proceed'
            });
        }
        next();
    } catch (error) {
        console.error('Validator check error:', error);
        res.status(500).json({ error: 'Error checking validator status' });
    }
}

export default validatorCheckMiddleware;