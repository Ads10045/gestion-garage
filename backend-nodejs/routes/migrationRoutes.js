const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

// Migration endpoint to convert DATE columns to TIMESTAMP
router.post('/migrate-dates', async (req, res) => {
    try {
        console.log('Starting migration: Converting DATE columns to TIMESTAMP...');
        
        // Alter date_diagnostic column
        await sequelize.query(`
            ALTER TABLE fiche_technique 
            ALTER COLUMN date_diagnostic TYPE TIMESTAMP WITH TIME ZONE 
            USING date_diagnostic::TIMESTAMP WITH TIME ZONE;
        `);
        
        // Alter date_reparation column
        await sequelize.query(`
            ALTER TABLE fiche_technique 
            ALTER COLUMN date_reparation TYPE TIMESTAMP WITH TIME ZONE 
            USING date_reparation::TIMESTAMP WITH TIME ZONE;
        `);
        
        // Verify the changes
        const [results] = await sequelize.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'fiche_technique' 
            AND column_name IN ('date_diagnostic', 'date_reparation');
        `);
        
        res.json({
            success: true,
            message: 'Migration completed successfully',
            columns: results
        });
    } catch (error) {
        console.error('Migration failed:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
