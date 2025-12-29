const express = require('express');
const router = express.Router();
const StatsController = require('../controllers/StatsController');

/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clients:
 *                   type: integer
 *                 vehicules:
 *                   type: integer
 *                 fiches:
 *                   type: integer
 */
router.get('/', StatsController.index);

module.exports = router;
