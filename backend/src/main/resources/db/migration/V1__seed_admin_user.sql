-- =====================================================
-- Flyway Migration: Seed Admin User
-- =====================================================
-- Description: Creates the initial admin user for the system
-- Idempotent: Safe to run multiple times (uses WHERE NOT EXISTS)
-- =====================================================

-- Insert admin user only if it doesn't already exist
-- This prevents duplicate entries and ensures idempotency
-- NOTE: This migration assumes the 'users' table already exists
-- If table doesn't exist, Hibernate will create it first (if ddl-auto=update)
-- OR you need to create it manually before running this migration

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

-- =====================================================
-- Migration Notes:
-- =====================================================
-- 1. This migration is IDEMPOTENT - safe to run multiple times
-- 2. Uses WHERE NOT EXISTS to prevent duplicate inserts
-- 3. Checks both mobile_number and email to ensure uniqueness
-- 4. password_hash is NULL (OTP-based login, no password needed)
-- 5. created_at and updated_at are set to current timestamp
-- 6. This admin can login using OTP via mobile or email
-- =====================================================

