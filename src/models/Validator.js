// src/models/validator.js
const db = require('../config/database');

class Validator {
    static async activateValidator(userId, txHash) {
        try {
            // Extract only first part of hash if needed
            const processedHash = txHash.split(':')[0] || txHash;
            
            const query = `
                UPDATE users 
                SET validator_status = true,
                    poc_tx_hash = ?,
                    poc_timestamp = CURRENT_TIMESTAMP
                WHERE id = ?
            `;

            console.log('Executing query with:', {
                userId,
                processedHash: processedHash.substring(0, 50) // Log first 50 chars for debugging
            });

            const [result] = await db.query(query, [processedHash, userId]);

            if (result.affectedRows === 0) {
                throw new Error('User not found or update failed');
            }

            return { success: true };
        } catch (error) {
            console.error('Database error in activateValidator:', error);
            throw new Error(`Failed to activate validator: ${error.message}`);
        }
    }

    static async getValidatorStatus(userId) {
        try {
            const [rows] = await db.query(
                'SELECT validator_status, poc_tx_hash FROM users WHERE id = ? LIMIT 1',
                [userId]
            );
            return rows[0] || { validator_status: false, poc_tx_hash: null };
        } catch (error) {
            console.error('Database error in getValidatorStatus:', error);
            throw error;
        }
    }
}

module.exports = Validator;