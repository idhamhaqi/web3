import express from 'express';
const router = express.Router();

// Privacy Policy route
router.get('/privacy', (req, res) => {
    res.render('privacy', {
        title: 'Privacy Policy - Zuxton'
    });
});

// Terms of Service route
router.get('/terms', (req, res) => {
    res.render('tos', {
        title: 'Terms of Service - Zuxton'
    });
});

// airdrop route
router.get('/airdrop', (req, res) => {
    res.render('airdrop', {
        title: 'Airdrop Program - Zuxton'
    });
});

export default router;