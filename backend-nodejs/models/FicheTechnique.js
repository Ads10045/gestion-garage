const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Vehicule = require('./Vehicule');
const FichePanne = require('./FichePanne');
const FichePiece = require('./FichePiece');

const FicheTechnique = sequelize.define('FicheTechnique', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    
    // Vehicle Info (Stored directly in this table too for some reason in the schema)
    immatriculation: { type: DataTypes.STRING },
    marque: { type: DataTypes.STRING },
    modele: { type: DataTypes.STRING },
    annee: { type: DataTypes.INTEGER },
    kilometrage: { type: DataTypes.INTEGER },

    // Diagnostic
    descriptionDiagnostic: { type: DataTypes.TEXT, field: 'description_diagnostic' },
    gravite: { type: DataTypes.STRING },
    reparable: { type: DataTypes.BOOLEAN },
    
    // Component States
    etatMoteur: { type: DataTypes.STRING, field: 'etat_moteur' },
    etatFreins: { type: DataTypes.STRING, field: 'etat_freins' },
    etatSuspension: { type: DataTypes.STRING, field: 'etat_suspension' },
    etatElectrique: { type: DataTypes.STRING, field: 'etat_electrique' },
    etatCarrosserie: { type: DataTypes.STRING, field: 'etat_carrosserie' },
    etatGeneral: { type: DataTypes.STRING, field: 'etat_general' },

    // Repair Info
    coutPieces: { type: DataTypes.DOUBLE, field: 'cout_pieces' },
    coutMainOeuvre: { type: DataTypes.DOUBLE, field: 'cout_main_oeuvre' },
    dureeReparationHeures: { type: DataTypes.INTEGER, field: 'duree_reparation_heures' },
    dateReparation: { type: DataTypes.DATE, field: 'date_reparation' },
    
    // Status
    dateDiagnostic: { type: DataTypes.DATE, field: 'date_diagnostic' },
    observationMecanicien: { type: DataTypes.TEXT, field: 'observation_mecanicien' },
    statut: { type: DataTypes.STRING },
    
    vehicule_id: { type: DataTypes.INTEGER }
}, {
    tableName: 'fiche_technique',
    timestamps: false,
    freezeTableName: true,
    underscored: true
});

FicheTechnique.belongsTo(Vehicule, { foreignKey: 'vehicule_id', as: 'vehicule' });
Vehicule.hasMany(FicheTechnique, { foreignKey: 'vehicule_id', as: 'fiches' });

FicheTechnique.hasMany(FichePanne, { foreignKey: 'fiche_id', as: 'pannesList' });
FichePanne.belongsTo(FicheTechnique, { foreignKey: 'fiche_id' });

FicheTechnique.hasMany(FichePiece, { foreignKey: 'fiche_id', as: 'piecesList' });
FichePiece.belongsTo(FicheTechnique, { foreignKey: 'fiche_id' });

module.exports = FicheTechnique;
