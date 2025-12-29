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
            ssl: process.env.DB_HOST && process.env.DB_HOST.includes('neon.tech') ? {
                require: true,
                rejectUnauthorized: false
            } : false
        }
    }
);

module.exports = sequelize;
