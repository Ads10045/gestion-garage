const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Client = require('./Client');

const Vehicule = sequelize.define('Vehicule', {
    immatriculationPart1: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'immatriculation_part1'
    },
    immatriculationPart2: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'immatriculation_part2'
    },
    immatriculationPart3: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'immatriculation_part3'
    },
    marque: {
        type: DataTypes.STRING,
        allowNull: false
    },
    modele: {
        type: DataTypes.STRING,
        allowNull: false
    },
    typeVehicule: {
        type: DataTypes.STRING,
        field: 'type_vehicule'
    },
    carburant: {
        type: DataTypes.STRING
    },
    couleur: {
        type: DataTypes.STRING
    },
    puissanceFiscale: {
        type: DataTypes.INTEGER,
        field: 'puissance_fiscale'
    },
    anneeMiseCirculation: {
        type: DataTypes.INTEGER,
        field: 'annee_mise_circulation'
    },
    numeroChassis: {
        type: DataTypes.STRING,
        field: 'numero_chassis'
    },
    kilometrageCompteur: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'kilometrage_compteur'
    },
    client_id: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'vehicule',
    timestamps: false,
    freezeTableName: true,
    underscored: true
});

// Define Relationship with explicit alias 'client'
Vehicule.belongsTo(Client, { foreignKey: 'client_id', as: 'client', onDelete: 'CASCADE' });
Client.hasMany(Vehicule, { foreignKey: 'client_id', as: 'vehicules' });

module.exports = Vehicule;
