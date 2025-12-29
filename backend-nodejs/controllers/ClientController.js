const { Op } = require('sequelize');
const Client = require('../models/Client');
const Vehicule = require('../models/Vehicule');
const FicheTechnique = require('../models/FicheTechnique');
const FichePanne = require('../models/FichePanne');
const FichePiece = require('../models/FichePiece');

// Get all clients (paginated)
exports.index = async (req, res) => {
    try {
        const query = req.query.query || '';
        const page = parseInt(req.query.page) || 0;
        const size = parseInt(req.query.size) || 10;
        const offset = page * size;

        const { count, rows } = await Client.findAndCountAll({
            where: {
                [Op.or]: [
                    { nom: { [Op.iLike]: `%${query}%` } },
                    { prenom: { [Op.iLike]: `%${query}%` } },
                    { telephone: { [Op.iLike]: `%${query}%` } }
                ]
            },
            include: { 
                model: Vehicule, 
                as: 'vehicules', 
                attributes: ['id', 'immatriculationPart1', 'immatriculationPart2', 'immatriculationPart3', 'marque', 'modele'] 
            },
            limit: size,
            offset: offset,
            order: [['nom', 'ASC']]
        });

        res.json({
            content: rows,
            totalElements: count,
            totalPages: Math.ceil(count / size),
            size: size,
            number: page,
            first: page === 0,
            last: page >= Math.ceil(count / size) - 1,
            empty: rows.length === 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new client
exports.store = async (req, res) => {
    try {
        const client = await Client.create(req.body);
        res.status(201).json(client);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a single client
exports.show = async (req, res) => {
    try {
        const client = await Client.findByPk(req.params.id, {
            include: { model: require('../models/Vehicule'), as: 'vehicules' }
        });
        if (!client) return res.status(404).json({ message: 'Client not found' });
        res.json(client);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a client
exports.update = async (req, res) => {
    try {
        const client = await Client.findByPk(req.params.id);
        if (!client) return res.status(404).json({ message: 'Client not found' });
        
        await client.update(req.body);
        res.json(client);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a client
// Delete a client with manual cascade
exports.destroy = async (req, res) => {
    try {
        const client = await Client.findByPk(req.params.id);
        if (!client) return res.status(404).json({ message: 'Client not found' });
        
        // Find all vehicles
        const vehicles = await Vehicule.findAll({ where: { client_id: client.id }, attributes: ['id'] });
        const vehicleIds = vehicles.map(v => v.id);

        if (vehicleIds.length > 0) {
            // Find all fiches for these vehicles
            const fiches = await FicheTechnique.findAll({ where: { vehicule_id: { [Op.in]: vehicleIds } }, attributes: ['id'] });
            const ficheIds = fiches.map(f => f.id);

            if (ficheIds.length > 0) {
                // Delete Pannes & Pieces
                await FichePanne.destroy({ where: { fiche_id: { [Op.in]: ficheIds } } });
                await FichePiece.destroy({ where: { fiche_id: { [Op.in]: ficheIds } } });
                
                // Delete Fiches
                await FicheTechnique.destroy({ where: { id: { [Op.in]: ficheIds } } });
            }

            // Delete Vehicles
            await Vehicule.destroy({ where: { id: { [Op.in]: vehicleIds } } });
        }

        // Delete Client
        await client.destroy();
        res.json({ message: 'Client deleted' });
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({ message: error.message });
    }
};
