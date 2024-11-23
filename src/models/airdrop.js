// routes/airdrop.js
import db from '../config/database.js';
import airdropConfig from '../config/airdropConfig.js';

class Airdrop {
    // Method untuk mendapatkan settings
    static getSettings() {
        return {
            is_active: airdropConfig.IS_ACTIVE,
            minimum_points: airdropConfig.MINIMUM_POINTS
        };
    }

    // Method untuk cek eligibility
    static async checkEligibility(userId) {
        try {
            // Get user's total points
            const [rows] = await db.query(
                `SELECT COALESCE(SUM(points_earned), 0) as total_points 
                 FROM node_sessions 
                 WHERE user_id = ?`,
                [userId]
            );

            const totalPoints = rows[0].total_points || 0;

            return {
                eligible: totalPoints >= airdropConfig.MINIMUM_POINTS,
                points: totalPoints,
                required: airdropConfig.MINIMUM_POINTS
            };
        } catch (error) {
            throw error;
        }
    }
}

export default Airdrop;