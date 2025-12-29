const Client = require('../models/Client');
const Vehicule = require('../models/Vehicule');
const FicheTechnique = require('../models/FicheTechnique');

exports.index = async (req, res) => {
    try {
        const totalClients = await Client.count();
        const totalVehicules = await Vehicule.count();
        const totalVisites = await FicheTechnique.count();
        
        res.json({
            totalClients,
            totalVehicules,
            totalFiches: totalVisites
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
