-- Migration to change date columns to timestamp with time zone
-- This will preserve the time component when saving dates

-- Alter date_diagnostic column
ALTER TABLE fiche_technique 
ALTER COLUMN date_diagnostic TYPE TIMESTAMP WITH TIME ZONE 
USING date_diagnostic::TIMESTAMP WITH TIME ZONE;

-- Alter date_reparation column  
ALTER TABLE fiche_technique 
ALTER COLUMN date_reparation TYPE TIMESTAMP WITH TIME ZONE 
USING date_reparation::TIMESTAMP WITH TIME ZONE;

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'fiche_technique' 
AND column_name IN ('date_diagnostic', 'date_reparation');
