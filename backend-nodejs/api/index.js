// Vercel Serverless Function Entry Point
const sequelize = require('../config/database');

let app;
let dbSynced = false;

async function initializeApp() {
    if (!app) {
        app = require('../server');
    }
    
    if (!dbSynced) {
        try {
            await sequelize.sync({ force: false });
            console.log('Database synced for serverless');
            dbSynced = true;
        } catch (error) {
            console.error('Database sync error:', error);
        }
    }
    
    return app;
}

module.exports = async (req, res) => {
    const application = await initializeApp();
    return application(req, res);
};
