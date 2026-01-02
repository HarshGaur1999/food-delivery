-- =====================================================
-- MANUAL ADMIN USER INSERT (TEMPORARY FIX)
-- =====================================================
-- Use this ONLY if Flyway migration didn't run
-- This is a SAFE, IDEMPOTENT insert
-- =====================================================

-- Step 1: Ensure users table exists
-- If table doesn't exist, create it first (or let Hibernate create it)
-- Then run the insert below

-- Step 2: Insert admin user (idempotent - safe to run multiple times)
INSERT INTO users (
    full_name,
    mobile_number,
    email,
    role,
    is_active,
    password_hash,
    created_at,
    updated_at
)
SELECT 
    'System Admin' AS full_name,
    '9389110115' AS mobile_number,
    'harshg101999@gmail.com' AS email,
    'ADMIN' AS role,
    1 AS is_active,
    NULL AS password_hash,
    NOW() AS created_at,
    NOW() AS updated_at
WHERE NOT EXISTS (
    SELECT 1 
    FROM users 
    WHERE mobile_number = '9389110115' 
       OR email = 'harshg101999@gmail.com'
);

-- Step 3: Verify insert
SELECT 
    id,
    full_name,
    mobile_number,
    email,
    role,
    is_active,
    created_at
FROM users
WHERE mobile_number = '9389110115' 
  AND role = 'ADMIN';

-- Expected output:
-- id | full_name    | mobile_number | email                    | role  | is_active | created_at
-- 1  | System Admin | 9389110115    | harshg101999@gmail.com  | ADMIN | 1         | 2024-01-02 10:30:00

-- =====================================================
-- TROUBLESHOOTING
-- =====================================================

-- If insert fails with "Table 'users' doesn't exist":
-- 1. Check if table exists:
SHOW TABLES LIKE 'users';

-- 2. If table doesn't exist, temporarily change application.properties:
--    spring.jpa.hibernate.ddl-auto=update
-- 3. Restart app to create table
-- 4. Change back to: spring.jpa.hibernate.ddl-auto=validate
-- 5. Run this insert again

-- If insert fails with duplicate key error:
-- The user already exists, which is fine!
-- Just verify with the SELECT query above

-- =====================================================

