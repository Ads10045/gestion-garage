const sequelize = require('./config/database');

async function cleanupTables() {
    try {
        console.log('Starting database cleanup...\n');
        
        // Tables to keep (used by Node.js backend)
        const tablesToKeep = [
            'client',
            'vehicule', 
            'fiche_technique',
            'fiche_panne',
            'fiche_piece',
            'users'
        ];
        
        // Tables to drop (Laravel leftovers and unused tables)
        const tablesToDrop = [
            'Clients',
            'FicheTechniques',
            'Users',
            'Vehicules',
            'cache',
            'cache_locks',
            'defaut',
            'failed_jobs',
            'fiche_pannes',
            'fiche_pieces_changees',
            'job_batches',
            'jobs',
            'migrations',
            'password_reset_tokens',
            'reparation',
            'sessions',
            'visite_technique'
        ];
        
        console.log('Tables to drop:');
        tablesToDrop.forEach(t => console.log(`  - ${t}`));
        console.log('');
        
        // Drop each table
        for (const tableName of tablesToDrop) {
            try {
                await sequelize.query(`DROP TABLE IF EXISTS "${tableName}" CASCADE`);
                console.log(`✓ Dropped ${tableName}`);
            } catch (err) {
                console.log(`⚠ Could not drop ${tableName}: ${err.message}`);
            }
        }
        
        // Verify remaining tables
        const [tables] = await sequelize.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        `);
        
        console.log('\n✓ Cleanup completed!');
        console.log('\nRemaining tables:');
        tables.forEach(t => console.log(`  - ${t.table_name}`));
        
        await sequelize.close();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

cleanupTables();
