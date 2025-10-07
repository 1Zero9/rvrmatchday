-- Add captain and vice-captain columns to players table

DO $$
BEGIN
  -- Add is_captain column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'players' AND column_name = 'is_captain') THEN
    ALTER TABLE players ADD COLUMN is_captain BOOLEAN DEFAULT false;
    RAISE NOTICE 'Added is_captain column to players table';
  END IF;
  
  -- Add is_vice_captain column if it doesn't exist  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'players' AND column_name = 'is_vice_captain') THEN
    ALTER TABLE players ADD COLUMN is_vice_captain BOOLEAN DEFAULT false;
    RAISE NOTICE 'Added is_vice_captain column to players table';
  END IF;
  
  -- Ensure only one captain per team
  CREATE OR REPLACE FUNCTION ensure_single_captain()
  RETURNS TRIGGER AS $func$
  BEGIN
    IF NEW.is_captain = true THEN
      UPDATE players 
      SET is_captain = false 
      WHERE team_id = NEW.team_id 
        AND id != NEW.id 
        AND is_captain = true;
    END IF;
    
    IF NEW.is_vice_captain = true THEN
      UPDATE players 
      SET is_vice_captain = false 
      WHERE team_id = NEW.team_id 
        AND id != NEW.id 
        AND is_vice_captain = true;
    END IF;
    
    RETURN NEW;
  END;
  $func$ LANGUAGE plpgsql;
  
  -- Create trigger if it doesn't exist
  DROP TRIGGER IF EXISTS trigger_ensure_single_captain ON players;
  CREATE TRIGGER trigger_ensure_single_captain
    BEFORE INSERT OR UPDATE ON players
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_captain();
    
  RAISE NOTICE 'Captain/Vice-Captain constraints and triggers added successfully';
END $$;