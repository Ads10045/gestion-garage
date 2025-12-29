const sequelize = require('./config/database');
const fs = require('fs');

async function exportData() {
    try {
        console.log('Exporting database data...\n');
        
        // Get all tables
        const [tables] = await sequelize.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        `);
        
        console.log('Tables found:', tables.map(t => t.table_name).join(', '));
        
        const backup = {
            exportDate: new Date().toISOString(),
            database: 'visite_technique',
            tables: {}
        };
        
        // Export data from each table
        for (const table of tables) {
            const tableName = table.table_name;
            try {
                const [rows] = await sequelize.query(`SELECT * FROM "${tableName}"`);
                backup.tables[tableName] = {
                    rowCount: rows.length,
                    data: rows
                };
                console.log(`✓ Exported ${tableName}: ${rows.length} rows`);
            } catch (err) {
                console.log(`⚠ Skipped ${tableName}: ${err.message}`);
            }
        }
        
        // Save to file
        const filename = `backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
        fs.writeFileSync(filename, JSON.stringify(backup, null, 2));
        console.log(`\n✓ Backup saved to: ${filename}`);
        
        // List unused tables (tables not in our models)
        const usedTables = ['client', 'vehicule', 'fiche_technique', 'fiche_panne', 'fiche_piece', 'users'];
        const unusedTables = tables
            .map(t => t.table_name)
            .filter(name => !usedTables.includes(name) && !name.startsWith('SequelizeMeta'));
        
        if (unusedTables.length > 0) {
            console.log('\n⚠️  Unused tables detected:');
            unusedTables.forEach(t => console.log(`   - ${t}`));
        } else {
            console.log('\n✓ No unused tables found');
        }
        
        await sequelize.close();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

exportData();
