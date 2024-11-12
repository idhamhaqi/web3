// src/routes/dashboard.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Validator = require('../models/validator');
const authMiddleware = require('../middleware/auth');

// Dashboard page
router.get('/', (req, res) => {
    res.render('dashboard');
});

// Dashboard data API
router.get('/data', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByWallet(req.user.wallet);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const validatorInfo = await Validator.getValidatorStatus(user.id);
        const referrals = await User.getReferrals(user.id);

        res.json({
            user: {
                ...user,
                validator_status: validatorInfo.validator_status,
                poc_tx_hash: validatorInfo.poc_tx_hash,
                referral_code: user.referral_code || ''
            },
            referrals: referrals || []
        });
    } catch (error) {
        console.error('Dashboard data error:', error);
        res.status(500).json({ error: 'Failed to load dashboard data' });
    }
});

// Activate validator
router.post('/activate-validator', authMiddleware, async (req, res) => {
    try {
        const { txHash } = req.body;
        
        if (!txHash) {
            return res.status(400).json({ 
                error: 'Transaction hash is required' 
            });
        }

        console.log('Received activation request:', {
            userId: req.user.id,
            txHashLength: txHash.length,
            txHashPreview: txHash.substring(0, 50) // Log first 50 chars
        });

        await Validator.activateValidator(req.user.id, txHash);
        
        res.json({ 
            success: true,
            message: 'Validator activated successfully'
        });
    } catch (error) {
        console.error('Error in activate-validator:', error);
        res.status(500).json({ 
            error: 'Failed to activate validator',
            details: error.message 
        });
    }
});

module.exports = router;