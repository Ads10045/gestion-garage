const FicheTechnique = require('../models/FicheTechnique');
const Vehicule = require('../models/Vehicule');
const Client = require('../models/Client');
const FichePanne = require('../models/FichePanne');
const FichePiece = require('../models/FichePiece');
const { Op } = require('sequelize');

// Get all fiches (paginated)
exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0;
        const size = parseInt(req.query.size) || 10;
        const query = req.query.query || '';
        const offset = page * size;

        const { count, rows } = await FicheTechnique.findAndCountAll({
            include: [
                {
                    model: Vehicule,
                    as: 'vehicule',
                    include: { model: Client, as: 'client' },
                    where: query ? {
                        [Op.or]: [
                            { immatriculationPart1: { [Op.iLike]: `%${query}%` } },
                            { immatriculationPart2: { [Op.iLike]: `%${query}%` } },
                            { immatriculationPart3: { [Op.iLike]: `%${query}%` } }
                        ]
                    } : undefined
                },
                { model: FichePanne, as: 'pannesList' },
                { model: FichePiece, as: 'piecesList' }
            ],
            limit: size,
            offset: offset,
            order: [['dateDiagnostic', 'DESC']]
        });

        // Format for frontend
        const content = rows.map(r => {
            const json = r.toJSON();
            json.pannes = json.pannesList ? json.pannesList.map(p => p.panne) : [];
            json.piecesChangees = json.piecesList ? json.piecesList.map(p => p.piece) : [];
            return json;
        });

        res.json({
            content,
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

// Get recent fiches
exports.recent = async (req, res) => {
    try {
        const fiches = await FicheTechnique.findAll({
            limit: 5,
            order: [['dateDiagnostic', 'DESC']],
            include: [
                {
                    model: Vehicule,
                    as: 'vehicule',
                    include: { model: Client, as: 'client' }
                },
                { model: FichePanne, as: 'pannesList' },
                { model: FichePiece, as: 'piecesList' }
            ]
        });
        
        const formatted = fiches.map(r => {
            const json = r.toJSON();
            json.pannes = json.pannesList ? json.pannesList.map(p => p.panne) : [];
            json.piecesChangees = json.piecesList ? json.piecesList.map(p => p.piece) : [];
            return json;
        });

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new fiche
exports.store = async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.vehicule) {
            if (data.vehicule.id) {
                data.vehicule_id = data.vehicule.id;
            }
            delete data.vehicule;
        }

        const fiche = await FicheTechnique.create(data);

        // Handle Pannes
        if (req.body.pannes && Array.isArray(req.body.pannes)) {
            await Promise.all(req.body.pannes.map(p => 
                FichePanne.create({ fiche_id: fiche.id, panne: p })
            ));
        }

        // Handle Pieces
        if (req.body.piecesChangees && Array.isArray(req.body.piecesChangees)) {
            await Promise.all(req.body.piecesChangees.map(p => 
                FichePiece.create({ fiche_id: fiche.id, piece: p })
            ));
        }

        res.status(201).json(fiche);
    } catch (error) {
        console.error('Error creating fiche:', error);
        res.status(400).json({ message: error.message });
    }
};

// Get a single fiche
exports.show = async (req, res) => {
    try {
        const fiche = await FicheTechnique.findByPk(req.params.id, {
            include: [
                {
                    model: Vehicule,
                    as: 'vehicule',
                    include: { model: Client, as: 'client' }
                },
                { model: FichePanne, as: 'pannesList' },
                { model: FichePiece, as: 'piecesList' }
            ]
        });
        if (!fiche) return res.status(404).json({ message: 'FicheTechnique not found' });
        
        const json = fiche.toJSON();
        json.pannes = json.pannesList ? json.pannesList.map(p => p.panne) : [];
        json.piecesChangees = json.piecesList ? json.piecesList.map(p => p.piece) : [];
        
        res.json(json);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a fiche
exports.update = async (req, res) => {
    try {
        const fiche = await FicheTechnique.findByPk(req.params.id);
        if (!fiche) return res.status(404).json({ message: 'FicheTechnique not found' });
        
        const data = { ...req.body };
        if (data.vehicule) {
            if (data.vehicule.id) {
                data.vehicule_id = data.vehicule.id;
            }
            delete data.vehicule;
        }

        await fiche.update(data);

        // Handle Pannes (Delete old and re-insert)
        if (req.body.pannes && Array.isArray(req.body.pannes)) {
            await FichePanne.destroy({ where: { fiche_id: fiche.id } });
            await Promise.all(req.body.pannes.map(p => 
                FichePanne.create({ fiche_id: fiche.id, panne: p })
            ));
        }

        // Handle Pieces (Delete old and re-insert)
        if (req.body.piecesChangees && Array.isArray(req.body.piecesChangees)) {
            await FichePiece.destroy({ where: { fiche_id: fiche.id } });
            await Promise.all(req.body.piecesChangees.map(p => 
                FichePiece.create({ fiche_id: fiche.id, piece: p })
            ));
        }

        res.json(fiche);
    } catch (error) {
        console.error('Error updating fiche:', error);
        res.status(400).json({ message: error.message });
    }
};

// Delete a fiche
exports.destroy = async (req, res) => {
    try {
        const fiche = await FicheTechnique.findByPk(req.params.id);
        if (!fiche) return res.status(404).json({ message: 'FicheTechnique not found' });
        
        // Delete Pannes & Pieces
        await FichePanne.destroy({ where: { fiche_id: fiche.id } });
        await FichePiece.destroy({ where: { fiche_id: fiche.id } });

        await fiche.destroy();
        res.json({ message: 'FicheTechnique deleted' });
    } catch (error) {
        console.error('Error deleting fiche:', error);
        res.status(500).json({ message: error.message });
    }
};
