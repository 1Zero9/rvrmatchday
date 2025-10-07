-- Add coaches column to teams table for multi-coach support

DO $$
BEGIN
  -- Check if teams table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'teams') THEN
    
    -- Add coaches column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'teams' AND column_name = 'coaches') THEN
      ALTER TABLE teams ADD COLUMN coaches TEXT[] DEFAULT ARRAY[]::TEXT[];
      RAISE NOTICE 'Added coaches column to teams table';
    ELSE
      RAISE NOTICE 'Coaches column already exists in teams table';
    END IF;
    
  ELSE
    RAISE EXCEPTION 'Teams table does not exist';
  END IF;
END $$;