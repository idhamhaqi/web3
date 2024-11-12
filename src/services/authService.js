// src/services/authService.js
const User = require('../models/user');
const jwt = require('jsonwebtoken');

class AuthService {
    static async authenticateWallet(walletAddress, referralCode = null) {
        try {
            let user = await User.findByWallet(walletAddress);
            
            if (!user) {
                const userId = await User.createUser(walletAddress, referralCode);
                user = await User.findByWallet(walletAddress);
            }

            const token = jwt.sign(
                { id: user.id, wallet: walletAddress },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            return { user, token };
        } catch (error) {
            console.error('Authentication error:', error);
            throw error;
        }
    }

    static verifySession(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch {
            return null;
        }
    }
}

module.exports = AuthService;