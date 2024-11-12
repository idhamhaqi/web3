// src/routes/auth.js
const express = require('express');
const router = express.Router();
const AuthService = require('../services/authService');

// Landing page
router.get('/', function(req, res) {
    const referralCode = req.query.ref;
    res.render('index', { referralCode });
});

// Wallet authentication
router.post('/auth/wallet', function(req, res) {
    const { walletAddress, referralCode } = req.body;
    
    AuthService.authenticateWallet(walletAddress, referralCode)
        .then(auth => {
            res.json(auth);
        })
        .catch(error => {
            console.error('Auth error:', error);
            res.status(500).json({ error: 'Authentication failed' });
        });
});

module.exports = router;