-- Fix coaches table structure
-- Check if coaches table exists and has the right columns

DO $$
BEGIN
  -- Check if coaches table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'coaches') THEN
    -- Check if name column exists, if not add it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'coaches' AND column_name = 'name') THEN
      -- Add name column if it doesn't exist
      ALTER TABLE coaches ADD COLUMN name TEXT;
      
      -- If first_name and last_name exist, populate name column
      IF EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'coaches' AND column_name = 'first_name') THEN
        UPDATE coaches SET name = COALESCE(first_name || ' ' || COALESCE(last_name, ''), first_name, 'Coach');
      END IF;
    END IF;
    
    -- Make sure first_name allows null or has default
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'coaches' AND column_name = 'first_name' AND is_nullable = 'NO') THEN
      -- Remove NOT NULL constraint from first_name if it exists
      ALTER TABLE coaches ALTER COLUMN first_name DROP NOT NULL;
    END IF;
    
    -- Make sure email allows null or has default
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'coaches' AND column_name = 'email' AND is_nullable = 'NO') THEN
      -- Remove NOT NULL constraint from email if it exists
      ALTER TABLE coaches ALTER COLUMN email DROP NOT NULL;
    END IF;
  ELSE
    -- Create coaches table if it doesn't exist
    CREATE TABLE coaches (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      first_name TEXT,
      last_name TEXT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    
    -- Insert some default coaches
    INSERT INTO coaches (first_name, last_name, name, email) VALUES
    ('John', 'Smith', 'John Smith', 'john.smith@example.com'),
    ('Mary', 'O''Connor', 'Mary O''Connor', 'mary.oconnor@example.com'),
    ('David', 'Walsh', 'David Walsh', 'david.walsh@example.com');
  END IF;
END $$;