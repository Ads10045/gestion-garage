const { Op } = require('sequelize');
const Vehicule = require('../models/Vehicule');
const Client = require('../models/Client');
const FicheTechnique = require('../models/FicheTechnique');
const FichePanne = require('../models/FichePanne');
const FichePiece = require('../models/FichePiece');

// Get all vehicles (paginated)
exports.index = async (req, res) => {
    try {
        const { part1, part2, part3, page = 0, size = 10 } = req.query;
        const offset = parseInt(page) * parseInt(size);
        
        const where = {};
        if (part1) where.immatriculationPart1 = { [Op.iLike]: `%${part1}%` };
        if (part2) where.immatriculationPart2 = { [Op.iLike]: `%${part2}%` };
        if (part3) where.immatriculationPart3 = { [Op.iLike]: `%${part3}%` };

        const { count, rows } = await Vehicule.findAndCountAll({
            where,
            include: { model: Client, as: 'client' },
            limit: parseInt(size),
            offset: offset,
            order: [['marque', 'ASC']]
        });

        res.json({
            content: rows,
            totalElements: count,
            totalPages: Math.ceil(count / parseInt(size)),
            size: parseInt(size),
            number: parseInt(page),
            first: parseInt(page) === 0,
            last: parseInt(page) >= Math.ceil(count / parseInt(size)) - 1,
            empty: rows.length === 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new vehicle
exports.store = async (req, res) => {
    try {
        const data = { ...req.body };
        // Remove nested object to avoid Sequelize trying to create/map it wrongly
        if (data.client) {
            if (data.client.id) {
                data.client_id = data.client.id;
            }
            delete data.client;
        }
        
        const vehicle = await Vehicule.create(data);
        res.status(201).json(vehicle);
    } catch (error) {
        console.error('Error creating vehicle:', error);
        res.status(400).json({ message: error.message });
    }
};

// Get a single vehicle
exports.show = async (req, res) => {
    try {
        const vehicle = await Vehicule.findByPk(req.params.id, { 
            include: [
                { model: Client, as: 'client' },
                { 
                    model: require('../models/FicheTechnique'), 
                    as: 'fiches',
                    attributes: ['id', 'dateDiagnostic', 'kilometrage', 'statut'] 
                }
            ]
        });
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a vehicle
exports.update = async (req, res) => {
    try {
        const vehicle = await Vehicule.findByPk(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        
        const data = { ...req.body };
        if (req.body.client && req.body.client.id) {
            data.client_id = req.body.client.id;
        }
        
        await vehicle.update(data);
        res.json(vehicle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a vehicle
// Delete a vehicle with manual cascade
exports.destroy = async (req, res) => {
    try {
        const vehicle = await Vehicule.findByPk(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        
        // Find all fiches for this vehicle
        const fiches = await FicheTechnique.findAll({ where: { vehicule_id: vehicle.id }, attributes: ['id'] });
        const ficheIds = fiches.map(f => f.id);

        if (ficheIds.length > 0) {
            // Delete Pannes & Pieces
            await FichePanne.destroy({ where: { fiche_id: { [Op.in]: ficheIds } } });
            await FichePiece.destroy({ where: { fiche_id: { [Op.in]: ficheIds } } });
            
            // Delete Fiches
            await FicheTechnique.destroy({ where: { id: { [Op.in]: ficheIds } } });
        }

        // Delete Vehicle
        await vehicle.destroy();
        res.json({ message: 'Vehicle deleted' });
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        res.status(500).json({ message: error.message });
    }
};
