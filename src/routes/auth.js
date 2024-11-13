import express from 'express';
import AuthService from '../services/authService.js';

const router = express.Router();

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

export default router;