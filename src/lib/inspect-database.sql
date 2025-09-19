-- Database Schema Inspection
-- Run this to see what tables and columns already exist

-- List all tables in the public schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Show columns for teams table (if it exists)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'teams' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show columns for players table (if it exists)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'players' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show columns for matches table (if it exists)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'matches' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show all constraints on teams table
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints 
WHERE table_name = 'teams' AND table_schema = 'public';

-- Show foreign key relationships
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public';