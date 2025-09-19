-- Check existing column structure
SELECT 'teams' as table_name, column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'teams' AND table_schema = 'public'
UNION ALL
SELECT 'players' as table_name, column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'players' AND table_schema = 'public'
UNION ALL
SELECT 'matches' as table_name, column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'matches' AND table_schema = 'public'
UNION ALL
SELECT 'match_events' as table_name, column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'match_events' AND table_schema = 'public'
ORDER BY table_name, column_name;