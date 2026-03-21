-- Test connection and check current schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
LIMIT 10;
