-- Fix all coaches table constraints comprehensively

DO $$
BEGIN
  -- Check if coaches table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'coaches') THEN
    
    -- Add name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'coaches' AND column_name = 'name') THEN
      ALTER TABLE coaches ADD COLUMN name TEXT;
      
      -- Populate name column from existing data
      IF EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'coaches' AND column_name = 'first_name') THEN
        UPDATE coaches SET name = COALESCE(first_name || ' ' || COALESCE(last_name, ''), first_name, 'Coach');
      END IF;
    END IF;
    
    -- Remove NOT NULL constraints from all columns except id
    DECLARE
      column_record RECORD;
    BEGIN
      FOR column_record IN 
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'coaches' 
          AND is_nullable = 'NO' 
          AND column_name NOT IN ('id')
      LOOP
        EXECUTE format('ALTER TABLE coaches ALTER COLUMN %I DROP NOT NULL', column_record.column_name);
      END LOOP;
    END;
    
    -- Set default values for existing NULL records
    UPDATE coaches SET 
      first_name = COALESCE(first_name, split_part(name, ' ', 1), 'Coach'),
      last_name = COALESCE(last_name, CASE 
        WHEN position(' ' IN name) > 0 THEN substring(name FROM position(' ' IN name) + 1)
        ELSE ''
      END),
      email = COALESCE(email, lower(COALESCE(first_name, 'coach')) || '@example.com'),
      name = COALESCE(name, COALESCE(first_name, 'Coach'))
    WHERE name IS NULL OR first_name IS NULL OR email IS NULL;
    
  ELSE
    -- Create coaches table if it doesn't exist (all columns nullable except id)
    CREATE TABLE coaches (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      first_name TEXT,
      last_name TEXT,
      name TEXT,
      email TEXT,
      phone TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    
    -- Insert default coaches
    INSERT INTO coaches (first_name, last_name, name, email) VALUES
    ('John', 'Smith', 'John Smith', 'john.smith@example.com'),
    ('Mary', 'O''Connor', 'Mary O''Connor', 'mary.oconnor@example.com'),
    ('David', 'Walsh', 'David Walsh', 'david.walsh@example.com');
  END IF;
  
END $$;