-- Delete all users and authentication data
DELETE FROM auth.users;
TRUNCATE auth.users CASCADE;

-- Reset the schema
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
GRANT ALL ON SCHEMA public TO authenticated;
GRANT ALL ON SCHEMA public TO service_role;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Reset all sequences
ALTER SEQUENCE IF EXISTS "Profile_id_seq" RESTART WITH 1;
ALTER SEQUENCE IF EXISTS "Product_id_seq" RESTART WITH 1;
ALTER SEQUENCE IF EXISTS "Order_id_seq" RESTART WITH 1;
ALTER SEQUENCE IF EXISTS "OrderItem_id_seq" RESTART WITH 1;

-- Reset auth sequences
ALTER SEQUENCE IF EXISTS auth.users_id_seq RESTART WITH 1; 