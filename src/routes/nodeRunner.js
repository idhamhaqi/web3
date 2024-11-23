import express from 'express';
import db from '../config/database.js';
import authMiddleware from '../middleware/auth.js';
import validatorCheckMiddleware from '../middleware/validatorCheck.js';

const router = express.Router();

// Update points endpoint - akan dipanggil setiap menit
router.post('/update-points', authMiddleware, async (req, res) => {
    try {
        // Cek active session
        const [session] = await db.query(
            `SELECT id FROM node_sessions 
             WHERE user_id = ? AND status = 'running' 
             LIMIT 1`,
            [req.user.id]
        );

        if (!session || !session[0]) {
            return res.status(404).json({ error: 'No active node session found' });
        }

        // Generate random values
        const nodesValidated = Math.floor(Math.random() * 2) + 1; // Random 1-2 nodes
        const pointsPerNode = (Math.random() * 0.2 + 0.1).toFixed(1); // Random 0.1-0.3 points
        const totalPoints = (nodesValidated * pointsPerNode).toFixed(1); // Calculate total points

        // Update database dengan nilai random
        const [result] = await db.query(
            `UPDATE node_sessions 
             SET nodes_validated = nodes_validated + ?,
                 points_earned = points_earned + ?
             WHERE id = ? AND status = 'running'`,
            [nodesValidated, totalPoints, session[0].id]
        );

        res.json({ 
            success: true,
            details: {
                nodesValidated,
                pointsEarned: totalPoints
            }
        });

    } catch (error) {
        console.error('Error updating points:', error);
        res.status(500).json({ error: 'Failed to update points' });
    }
});

// Get status endpoint
router.get('/status', authMiddleware, async (req, res) => {
    try {
        const [currentSession] = await db.query(
            `SELECT 
                id,
                status,
                start_time,
                points_earned,
                nodes_validated,
                TIMESTAMPDIFF(MINUTE, start_time, CURRENT_TIMESTAMP) / 60.0 as runtime_hours
             FROM node_sessions 
             WHERE user_id = ? AND status = 'running'
             LIMIT 1`,
            [req.user.id]
        );

        const [todayStats] = await db.query(
            `SELECT 
                SUM(nodes_validated) as today_nodes,
                SUM(points_earned) as today_points,
                SUM(CASE 
                    WHEN status = 'running' 
                    THEN TIMESTAMPDIFF(MINUTE, start_time, CURRENT_TIMESTAMP) / 60.0
                    ELSE total_hours 
                END) as today_hours
             FROM node_sessions 
             WHERE user_id = ? 
             AND DATE(start_time) = CURDATE()`,
            [req.user.id]
        );

        const [totalStats] = await db.query(
            `SELECT 
                SUM(nodes_validated) as total_nodes,
                SUM(points_earned) as total_points,
                SUM(CASE 
                    WHEN status = 'running' 
                    THEN TIMESTAMPDIFF(MINUTE, start_time, CURRENT_TIMESTAMP) / 60.0
                    ELSE total_hours 
                END) as total_hours
             FROM node_sessions 
             WHERE user_id = ?`,
            [req.user.id]
        );

        res.json({
            status: currentSession[0] || null,
            stats: {
                today: {
                    nodes: todayStats[0].today_nodes || 0,
                    points: parseFloat(todayStats[0].today_points || 0).toFixed(1),
                    hours: parseFloat(todayStats[0].today_hours || 0).toFixed(2)
                },
                total: {
                    nodes: totalStats[0].total_nodes || 0,
                    points: parseFloat(totalStats[0].total_points || 0).toFixed(1),
                    hours: parseFloat(totalStats[0].total_hours || 0).toFixed(2)
                }
            }
        });
    } catch (error) {
        console.error('Error getting node status:', error);
        res.status(500).json({ error: 'Failed to get node status' });
    }
});

// Start node
router.post('/start', authMiddleware, validatorCheckMiddleware, async (req, res) => {
    try {
        const [running] = await db.query(
            'SELECT id FROM node_sessions WHERE user_id = ? AND status = "running"',
            [req.user.id]
        );

        if (running && running.length > 0) {
            return res.status(400).json({
                error: 'Node is already running'
            });
        }

        const [result] = await db.query(
            `INSERT INTO node_sessions 
            (user_id, start_time, status, points_earned, nodes_validated)
            VALUES (?, CURRENT_TIMESTAMP, 'running', 0, 0)`,
            [req.user.id]
        );

        res.json({
            success: true,
            sessionId: result.insertId,
            message: 'Node started successfully'
        });
    } catch (error) {
        console.error('Error starting node:', error);
        res.status(500).json({ 
            error: 'Failed to start node',
            message: error.message 
        });
    }
});

// Stop node
router.post('/stop', authMiddleware, async (req, res) => {
    try {
        const [session] = await db.query(
            'SELECT id, start_time FROM node_sessions WHERE user_id = ? AND status = "running"',
            [req.user.id]
        );

        if (!session || !session[0]) {
            return res.status(404).json({
                error: 'No active node session found'
            });
        }

        const startTime = new Date(session[0].start_time);
        const endTime = new Date();
        const diffMs = endTime - startTime;
        const diffHours = diffMs / (1000 * 60 * 60);
        const roundedHours = Math.max(diffHours, 0).toFixed(2);

        const [result] = await db.query(
            `UPDATE node_sessions 
             SET status = 'stopped',
                 end_time = CURRENT_TIMESTAMP,
                 total_hours = ?
             WHERE id = ? AND status = 'running'`,
            [roundedHours, session[0].id]
        );

        if (result.affectedRows > 0) {
            const [finalStats] = await db.query(
                `SELECT 
                    points_earned,
                    nodes_validated,
                    total_hours
                 FROM node_sessions 
                 WHERE id = ?`,
                [session[0].id]
            );

            res.json({
                success: true,
                message: 'Node stopped successfully',
                stats: finalStats[0]
            });
        } else {
            throw new Error('Failed to update session status');
        }
    } catch (error) {
        console.error('Error stopping node:', error);
        res.status(500).json({
            error: 'Failed to stop node',
            message: error.message
        });
    }
});

export default router;