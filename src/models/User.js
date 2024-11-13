import db from '../config/database.js';
import crypto from 'crypto';

class User {
    static async createUser(walletAddress, referralCode = null) {
        try {
            // Simpan wallet address langsung dalam format yang diterima
            const newReferralCode = crypto.randomBytes(5).toString('hex');
           
            const [result] = await db.execute(
                'INSERT INTO users (wallet_address, referral_code, referred_by) VALUES (?, ?, ?)',
                [walletAddress, newReferralCode, referralCode]
            );
           
            if (referralCode) {
                await this.trackReferral(referralCode, walletAddress);
            }
           
            return result.insertId;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    static async findByWallet(walletAddress) {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE wallet_address = ?',
            [walletAddress]
        );
        return rows[0];
    }

    static async getReferrals(userId) {
        const [rows] = await db.execute(
            `SELECT u.wallet_address, u.created_at
             FROM users u
             JOIN referrals r ON r.referred_id = u.id
             WHERE r.referrer_id = ?`,
            [userId]
        );
        return rows;
    }

    static async trackReferral(referrerCode, referredWalletAddress) {
        try {
            const [referrer] = await db.execute(
                'SELECT id FROM users WHERE referral_code = ?',
                [referrerCode]
            );
           
            const [referred] = await db.execute(
                'SELECT id FROM users WHERE wallet_address = ?',
                [referredWalletAddress]
            );
            if (referrer[0] && referred[0]) {
                await db.execute(
                    'INSERT INTO referrals (referrer_id, referred_id) VALUES (?, ?)',
                    [referrer[0].id, referred[0].id]
                );
            }
        } catch (error) {
            console.error('Error tracking referral:', error);
            throw error;
        }
    }
}

export default User;