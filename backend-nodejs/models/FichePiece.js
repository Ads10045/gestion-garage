const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FichePiece = sequelize.define('FichePiece', {
    fiche_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    piece: {
        type: DataTypes.STRING,
        primaryKey: true
    }
}, {
    tableName: 'fiche_pieces_changees',
    timestamps: false,
    freezeTableName: true,
    underscored: true
});

module.exports = FichePiece;
