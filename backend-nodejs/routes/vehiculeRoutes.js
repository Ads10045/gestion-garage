const express = require('express');
const router = express.Router();
const VehiculeController = require('../controllers/VehiculeController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Vehicule:
 *       type: object
 *       required:
 *         - immatriculation_part1
 *         - immatriculation_part2
 *         - immatriculation_part3
 *         - marque
 *         - modele
 *         - client_id
 *       properties:
 *         id:
 *           type: integer
 *         immatriculation_part1:
 *           type: string
 *         immatriculation_part2:
 *           type: string
 *         immatriculation_part3:
 *           type: string
 *         marque:
 *           type: string
 *         modele:
 *           type: string
 *         type_vehicule:
 *           type: string
 *         carburant:
 *           type: string
 *         puissance_fiscale:
 *           type: string
 *         annee_mise_circulation:
 *           type: string
 *         numero_chassis:
 *           type: string
 *         kilometrage_compteur:
 *           type: integer
 *         client_id:
 *           type: integer
 */

/**
 * @swagger
 * /vehicules:
 *   get:
 *     summary: Returns the list of all vehicules
 *     tags: [Vehicules]
 *     responses:
 *       200:
 *         description: The list of vehicules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicule'
 *   post:
 *     summary: Create a new vehicule
 *     tags: [Vehicules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehicule'
 *     responses:
 *       201:
 *         description: The created vehicule
 */
router.get('/', VehiculeController.index);
router.post('/', VehiculeController.store);

/**
 * @swagger
 * /vehicules/{id}:
 *   get:
 *     summary: Get the vehicule by id
 *     tags: [Vehicules]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The vehicule id
 *     responses:
 *       200:
 *         description: The vehicule by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicule'
 *       404:
 *         description: Vehicule not found
 *   put:
 *     summary: Update the vehicule by id
 *     tags: [Vehicules]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The vehicule id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehicule'
 *     responses:
 *       200:
 *         description: The vehicule was updated
 *       404:
 *         description: Vehicule not found
 *   delete:
 *     summary: Remove the vehicule by id
 *     tags: [Vehicules]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The vehicule id
 *     responses:
 *       200:
 *         description: Vehicule was deleted
 *       404:
 *         description: Vehicule not found
 */
router.get('/:id', VehiculeController.show);
router.put('/:id', VehiculeController.update);
router.delete('/:id', VehiculeController.destroy);

module.exports = router;
