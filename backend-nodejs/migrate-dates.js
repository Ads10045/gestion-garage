const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: console.log
});

async function migrate() {
  try {
    console.log('Starting migration: Converting DATE columns to TIMESTAMP...');
    
    // Alter date_diagnostic column
    await sequelize.query(`
      ALTER TABLE fiche_technique 
      ALTER COLUMN date_diagnostic TYPE TIMESTAMP WITH TIME ZONE 
      USING date_diagnostic::TIMESTAMP WITH TIME ZONE;
    `);
    console.log('✓ Converted date_diagnostic to TIMESTAMP');
    
    // Alter date_reparation column
    await sequelize.query(`
      ALTER TABLE fiche_technique 
      ALTER COLUMN date_reparation TYPE TIMESTAMP WITH TIME ZONE 
      USING date_reparation::TIMESTAMP WITH TIME ZONE;
    `);
    console.log('✓ Converted date_reparation to TIMESTAMP');
    
    // Verify the changes
    const [results] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'fiche_technique' 
      AND column_name IN ('date_diagnostic', 'date_reparation');
    `);
    
    console.log('\nColumn types after migration:');
    console.table(results);
    
    console.log('\n✓ Migration completed successfully!');
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    await sequelize.close();
    process.exit(1);
  }
}

migrate();
