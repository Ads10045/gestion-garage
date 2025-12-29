const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/ClientController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       required:
 *         - nom
 *         - prenom
 *         - telephone
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the client
 *         nom:
 *           type: string
 *         prenom:
 *           type: string
 *         cin:
 *           type: string
 *         email:
 *           type: string
 *         telephone:
 *           type: string
 *         adresse:
 *           type: string
 */

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Returns the list of all clients
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: The list of the clients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 *   post:
 *     summary: Create a new client
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       201:
 *         description: The created client
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 */
router.get('/', ClientController.index);
router.post('/', ClientController.store);

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     summary: Get the client by id
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The client id
 *     responses:
 *       200:
 *         description: The client description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       404:
 *         description: The client was not found
 *   put:
 *     summary: Update the client by the id
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The client id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       200:
 *         description: The client was updated
 *       404:
 *         description: The client was not found
 *   delete:
 *     summary: Remove the client by id
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The client id
 *     responses:
 *       200:
 *         description: The client was deleted
 *       404:
 *         description: The client was not found
 */
router.get('/:id', ClientController.show);
router.put('/:id', ClientController.update);
router.delete('/:id', ClientController.destroy);

module.exports = router;
