-- Add captain and vice-captain columns to players table (safe version)

DO $$
BEGIN
  -- Check if players table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'players') THEN
    
    -- Add is_captain column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'players' AND column_name = 'is_captain') THEN
      ALTER TABLE players ADD COLUMN is_captain BOOLEAN DEFAULT false NOT NULL;
      RAISE NOTICE 'Added is_captain column to players table';
    END IF;
    
    -- Add is_vice_captain column if it doesn't exist  
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'players' AND column_name = 'is_vice_captain') THEN
      ALTER TABLE players ADD COLUMN is_vice_captain BOOLEAN DEFAULT false NOT NULL;
      RAISE NOTICE 'Added is_vice_captain column to players table';
    END IF;
    
    -- Ensure only one captain and one vice-captain per team
    CREATE OR REPLACE FUNCTION ensure_single_team_leaders()
    RETURNS TRIGGER AS $func$
    BEGIN
      -- If setting someone as captain, remove captain from others on same team
      IF NEW.is_captain = true THEN
        UPDATE players 
        SET is_captain = false 
        WHERE team_id = NEW.team_id 
          AND id != NEW.id 
          AND is_captain = true;
        RAISE NOTICE 'Removed captain status from other players in team %', NEW.team_id;
      END IF;
      
      -- If setting someone as vice-captain, remove vice-captain from others on same team
      IF NEW.is_vice_captain = true THEN
        UPDATE players 
        SET is_vice_captain = false 
        WHERE team_id = NEW.team_id 
          AND id != NEW.id 
          AND is_vice_captain = true;
        RAISE NOTICE 'Removed vice-captain status from other players in team %', NEW.team_id;
      END IF;
      
      RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql;
    
    -- Create trigger if it doesn't exist
    DROP TRIGGER IF EXISTS trigger_ensure_single_team_leaders ON players;
    CREATE TRIGGER trigger_ensure_single_team_leaders
      BEFORE INSERT OR UPDATE OF is_captain, is_vice_captain ON players
      FOR EACH ROW
      WHEN (NEW.is_captain = true OR NEW.is_vice_captain = true)
      EXECUTE FUNCTION ensure_single_team_leaders();
      
    RAISE NOTICE 'Captain/Vice-Captain constraints and triggers added successfully';
    
  ELSE
    RAISE EXCEPTION 'Players table does not exist';
  END IF;
END $$;