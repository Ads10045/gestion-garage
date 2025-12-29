const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Client = sequelize.define('Client', {
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prenom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cin: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    telephone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    adresse: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'client',
    timestamps: false,
    freezeTableName: true,
    underscored: true
});

module.exports = Client;
