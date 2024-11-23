// routes/airdrop.js
import express from 'express';
import Airdrop from '../models/Airdrop.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/eligibility', authMiddleware, async (req, res) => {
    try {
        // req.user.id sudah benar karena token menyimpan {id: user.id}
        const eligibility = await Airdrop.checkEligibility(req.user.id);
        res.json(eligibility);
    } catch (error) {
        console.error('Error checking eligibility:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/settings', authMiddleware, (req, res) => {
    try {
        const settings = Airdrop.getSettings();
        res.json(settings);
    } catch (error) {
        console.error('Error getting settings:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;