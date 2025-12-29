const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'visite_technique',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASS || 'postgres',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false
    }
);

async function inspect() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const [tables] = await sequelize.query("SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema NOT IN ('information_schema', 'pg_catalog')");
        console.log('Found tables:', tables);

        for (const table of tables) {
            const { table_schema, table_name } = table;
            const [count] = await sequelize.query(`SELECT COUNT(*) FROM "${table_schema}"."${table_name}"`);
            console.log(`Schema: ${table_schema}, Table: ${table_name}, Count: ${count[0].count}`);
        }

    } catch (error) {
        console.error('Inspection failed:', error);
    } finally {
        await sequelize.close();
    }
}

inspect();
