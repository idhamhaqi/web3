import db from '../config/database.js';

class NodeRunner {
    static async startNode(userId) {
        try {
            // Check for any running sessions
            const [running] = await db.query(
                'SELECT id FROM node_sessions WHERE user_id = ? AND status = "running"',
                [userId]
            );
            if (running && running.length > 0) {
                throw new Error('Node is already running');
            }
            // Start new session
            const [result] = await db.query(
                `INSERT INTO node_sessions
                (user_id, start_time, status)
                VALUES (?, CURRENT_TIMESTAMP, 'running')`,
                [userId]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error starting node:', error);
            throw error;
        }
    }

    static async stopNode(userId) {
        try {
            const [result] = await db.query(
                `UPDATE node_sessions
                SET status = 'stopped',
                    end_time = CURRENT_TIMESTAMP,
                    total_hours = TIMESTAMPDIFF(HOUR, start_time, CURRENT_TIMESTAMP)
                WHERE user_id = ? AND status = 'running'`,
                [userId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error stopping node:', error);
            throw error;
        }
    }

    static async getNodeStatus(userId) {
        try {
            const [rows] = await db.query(
                `SELECT
                    id,
                    status,
                    start_time,
                    points_earned,
                    nodes_validated,
                    TIMESTAMPDIFF(MINUTE, start_time, CURRENT_TIMESTAMP) as runtime_minutes
                FROM node_sessions
                WHERE user_id = ? AND status = 'running'
                LIMIT 1`,
                [userId]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Error getting node status:', error);
            throw error;
        }
    }

    static async getStats(userId) {
        try {
            const [rows] = await db.query(
                `SELECT
                    COALESCE(SUM(total_hours), 0) as total_hours,
                    COALESCE(SUM(nodes_validated), 0) as total_nodes,
                    COALESCE(SUM(points_earned), 0) as total_points,
                    COALESCE((
                        SELECT SUM(nodes_validated)
                        FROM node_sessions
                        WHERE user_id = ?
                        AND DATE(start_time) = CURDATE()
                    ), 0) as today_nodes,
                    COALESCE((
                        SELECT SUM(points_earned)
                        FROM node_sessions
                        WHERE user_id = ?
                        AND DATE(start_time) = CURDATE()
                    ), 0) as today_points
                FROM node_sessions
                WHERE user_id = ?`,
                [userId, userId, userId]
            );
            return rows[0];
        } catch (error) {
            console.error('Error getting stats:', error);
            throw error;
        }
    }
}

export default NodeRunner;