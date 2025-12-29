const express = require('express');
const router = express.Router();
const FicheTechniqueController = require('../controllers/FicheTechniqueController');

/**
 * @swagger
 * components:
 *   schemas:
 *     VisiteTechnique:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         numero_visite:
 *           type: string
 *         type_visite:
 *           type: string
 *         date_visite:
 *           type: string
 *           format: date
 *         heure_visite:
 *           type: string
 *         centre_visite:
 *           type: string
 *         ville:
 *           type: string
 *         controleur:
 *           type: string
 *         kilometrage:
 *           type: integer
 *         resultat_final:
 *           type: string
 *         date_validite:
 *           type: string
 *           format: date
 *         vehicule_id:
 *           type: integer
 */

/**
 * @swagger
 * /fiches/recent:
 *   get:
 *     summary: Get recent visits
 *     tags: [Fiches]
 *     responses:
 *       200:
 *         description: List of recent visits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VisiteTechnique'
 */
router.get('/recent', FicheTechniqueController.recent);

/**
 * @swagger
 * /fiches:
 *   get:
 *     summary: Returns all visits
 *     tags: [Fiches]
 *     responses:
 *       200:
 *         description: The list of visits
 *   post:
 *     summary: Create a new visit
 *     tags: [Fiches]
 */
router.get('/', FicheTechniqueController.index);
router.post('/', FicheTechniqueController.store);

/**
 * @swagger
 * /fiches/{id}:
 *   get:
 *     summary: Get the visit by id
 *     tags: [Fiches]
 */
router.get('/:id', FicheTechniqueController.show);
router.put('/:id', FicheTechniqueController.update);
router.delete('/:id', FicheTechniqueController.destroy);

module.exports = router;
