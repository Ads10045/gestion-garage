const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FichePanne = sequelize.define('FichePanne', {
    fiche_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    panne: {
        type: DataTypes.STRING,
        primaryKey: true
    }
}, {
    tableName: 'fiche_pannes',
    timestamps: false,
    freezeTableName: true,
    underscored: true
});

module.exports = FichePanne;
