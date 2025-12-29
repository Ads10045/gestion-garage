const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'visite_technique',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASS || 'postgres',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            // Optional: for search_path if needed
            // options: "-c search_path=public"
        }
    }
);

module.exports = sequelize;
