# 🔍 ADMIN LOGIN DEBUG GUIDE - "Admin account not found"

## 🎯 Problem Statement

**Error**: `UnauthorizedException: Admin account not found. Please contact system administrator.`

**Query Executed**: 
```sql
SELECT * FROM users 
WHERE mobile_number = '9389110115' AND role = 'ADMIN'
```

**Result**: No rows found → Exception thrown

---

## 🔴 ROOT CAUSE ANALYSIS

### Possible Causes (Check in Order):

1. **Flyway Migration Not Executed** ⚠️ MOST LIKELY
   - Migration file exists but Flyway didn't run it
   - Check `flyway_schema_history` table

2. **Wrong Database Connection**
   - App connected to different database
   - Check `application.properties` database URL

3. **Migration File Not Detected**
   - File in wrong location
   - Wrong naming convention
   - Flyway disabled

4. **Role Value Mismatch**
   - Database has different role value
   - Enum vs DB string mismatch

5. **Hibernate DDL Auto = validate**
   - Table doesn't exist yet
   - Hibernate can't create it (validate mode)
   - Flyway should create it first

6. **Admin User Exists But Filtered Out**
   - `is_active = false`
   - Different mobile_number format
   - Different role value

---

## 📋 STEP-BY-STEP DEBUG CHECKLIST

### Step 1: Verify Database Connection

**Check which database you're connected to:**

```sql
-- Connect to MySQL
mysql -u root -p

-- Check current database
SELECT DATABASE();

-- List all databases
SHOW DATABASES;

-- Verify you're using correct database
USE food_delivery_db;
```

**Expected**: Should show `food_delivery_db`

**If wrong**: Update `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/food_delivery_db?...
```

---

### Step 2: Check if Users Table Exists

```sql
-- Check if users table exists
SHOW TABLES LIKE 'users';

-- If exists, check structure
DESCRIBE users;

-- Check if table is empty
SELECT COUNT(*) FROM users;
```

**Expected**: 
- Table exists
- Has columns: `id`, `mobile_number`, `email`, `role`, `is_active`, etc.
- May be empty (if migration didn't run)

---

### Step 3: Check Flyway Migration Status

```sql
-- Check if flyway_schema_history table exists
SHOW TABLES LIKE 'flyway_schema_history';

-- If exists, check migration history
SELECT 
    installed_rank,
    version,
    description,
    type,
    script,
    installed_on,
    success,
    execution_time
FROM flyway_schema_history
ORDER BY installed_rank;

-- Check specifically for admin migration
SELECT * FROM flyway_schema_history 
WHERE script LIKE '%admin%';
```

**Expected Results**:

**If migration ran successfully:**
```
installed_rank | version | description        | type | script                    | installed_on          | success
1              | 1       | seed admin user   | SQL  | V1__seed_admin_user.sql  | 2024-01-02 10:30:00   | 1
```

**If migration NOT run:**
- Table might not exist
- OR table exists but no rows
- OR no row with `script = 'V1__seed_admin_user.sql'`

---

### Step 4: Check if Admin User Exists

```sql
-- Check all users
SELECT 
    id,
    full_name,
    mobile_number,
    email,
    role,
    is_active,
    created_at
FROM users;

-- Check specifically for admin
SELECT 
    id,
    full_name,
    mobile_number,
    email,
    role,
    is_active,
    created_at
FROM users
WHERE role = 'ADMIN';

-- Check by mobile number
SELECT * FROM users 
WHERE mobile_number = '9389110115';

-- Check by email
SELECT * FROM users 
WHERE email = 'harshg101999@gmail.com';

-- Check exact match (what the query does)
SELECT * FROM users 
WHERE mobile_number = '9389110115' 
  AND role = 'ADMIN';
```

**Expected**: Should return 1 row with:
- `mobile_number = '9389110115'`
- `email = 'harshg101999@gmail.com'`
- `role = 'ADMIN'`
- `is_active = 1` (or `true`)

---

### Step 5: Check Role Values in Database

```sql
-- Check all distinct role values
SELECT DISTINCT role FROM users;

-- Check if role is stored correctly
SELECT 
    id,
    mobile_number,
    role,
    LENGTH(role) AS role_length,
    HEX(role) AS role_hex
FROM users
WHERE mobile_number = '9389110115';
```

**Expected**: 
- `role = 'ADMIN'` (exact match, no spaces)
- `role_length = 5`
- Should match enum value `Role.ADMIN`

**If different**: Role might be stored as `'ROLE_ADMIN'` or `'admin'` (case mismatch)

---

### Step 6: Check Flyway Configuration

**Check application.properties:**
```properties
# Should be enabled
spring.flyway.enabled=true

# Should point to correct location
spring.flyway.locations=classpath:db/migration

# Should baseline existing databases
spring.flyway.baseline-on-migrate=true

# Should validate migrations
spring.flyway.validate-on-migrate=true
```

**Check migration file location:**
```
backend/src/main/resources/db/migration/V1__seed_admin_user.sql
```

**Verify file naming:**
- ✅ `V1__seed_admin_user.sql` (correct)
- ❌ `V1_seed_admin_user.sql` (wrong - single underscore)
- ❌ `v1__seed_admin_user.sql` (wrong - lowercase V)

---

### Step 7: Check Application Logs

**Look for Flyway logs on startup:**

```
[INFO] Flyway Community Edition 10.x.x by Redgate
[INFO] Database: jdbc:mysql://localhost:3306/food_delivery_db
[INFO] Successfully validated 1 migration (execution time 00:00.012s)
[INFO] Current version of schema `food_delivery_db`: << Empty Schema >>
[INFO] Migrating schema `food_delivery_db` to version "1 - seed admin user"
[INFO] Successfully applied 1 migration to schema `food_delivery_db`
```

**If you see errors:**
- Check for connection errors
- Check for SQL syntax errors
- Check for permission errors

---

## 🛠️ FIXES

### Fix 1: Manual SQL Insert (TEMPORARY - Unblock Login)

**Use this ONLY if migration didn't run and you need immediate access:**

```sql
-- TEMPORARY FIX: Manual insert (use only if migration failed)
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
    TRUE AS is_active,
    NULL AS password_hash,
    NOW() AS created_at,
    NOW() AS updated_at
WHERE NOT EXISTS (
    SELECT 1 
    FROM users 
    WHERE mobile_number = '9389110115' 
       OR email = 'harshg101999@gmail.com'
);

-- Verify insert
SELECT * FROM users WHERE mobile_number = '9389110115';
```

**⚠️ WARNING**: This is a temporary fix. The proper solution is to fix Flyway migration.

---

### Fix 2: Force Flyway Migration Execution

**If migration didn't run, you can:**

1. **Restart application** (Flyway runs on startup)

2. **Manually trigger via Flyway CLI:**
   ```bash
   cd backend
   mvn flyway:migrate
   ```

3. **Check if Hibernate is blocking:**
   - If `users` table doesn't exist, Hibernate `validate` mode will fail
   - Solution: Change to `update` temporarily, then back to `validate`

---

### Fix 3: Verify and Fix Migration File

**Check file exists and is correct:**

```bash
# Check file location
ls -la backend/src/main/resources/db/migration/

# Should see:
# V1__seed_admin_user.sql
```

**If file missing or wrong location:**
- Create directory: `backend/src/main/resources/db/migration/`
- Place file: `V1__seed_admin_user.sql`
- Ensure double underscore `__` in filename

---

## ✅ VERIFICATION STEPS

### After Applying Fix:

1. **Check Migration Executed:**
   ```sql
   SELECT * FROM flyway_schema_history 
   WHERE script = 'V1__seed_admin_user.sql';
   ```

2. **Verify Admin User:**
   ```sql
   SELECT * FROM users 
   WHERE mobile_number = '9389110115' 
     AND role = 'ADMIN';
   ```

3. **Test OTP Login:**
   ```bash
   # Send OTP
   curl -X POST http://localhost:8080/api/v1/auth/admin/otp/send \
     -H "Content-Type: application/json" \
     -d '{"emailOrPhone": "9389110115"}'
   
   # Verify OTP (use OTP from console logs)
   curl -X POST http://localhost:8080/api/v1/auth/admin/otp/verify \
     -H "Content-Type: application/json" \
     -d '{"emailOrPhone": "9389110115", "otp": "123456"}'
   ```

4. **Expected Result:**
   ```json
   {
     "success": true,
     "message": "Login successful",
     "data": {
       "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "refreshToken": "...",
       "user": {
         "id": 1,
         "mobileNumber": "9389110115",
         "email": "harshg101999@gmail.com",
         "role": "ADMIN",
         "isActive": true
       }
     }
   }
   ```

---

## 🔧 COMMON ISSUES & SOLUTIONS

### Issue 1: Migration Not Running

**Symptoms:**
- `flyway_schema_history` table doesn't exist
- No migration records

**Solution:**
1. Check Flyway is enabled: `spring.flyway.enabled=true`
2. Check file location: `src/main/resources/db/migration/`
3. Check file naming: `V1__seed_admin_user.sql` (double underscore)
4. Restart application

---

### Issue 2: Hibernate Validate Fails

**Symptoms:**
- Error: `Table 'users' doesn't exist`
- Hibernate validation fails on startup

**Solution:**
1. Temporarily change `spring.jpa.hibernate.ddl-auto=update`
2. Start app (creates tables)
3. Change back to `validate`
4. Restart app (Flyway runs migration)

---

### Issue 3: Role Value Mismatch

**Symptoms:**
- User exists but query returns no rows
- Role stored as `'ROLE_ADMIN'` instead of `'ADMIN'`

**Solution:**
```sql
-- Check actual role value
SELECT role FROM users WHERE mobile_number = '9389110115';

-- If wrong, update it
UPDATE users 
SET role = 'ADMIN' 
WHERE mobile_number = '9389110115';
```

---

### Issue 4: Wrong Database

**Symptoms:**
- Migration ran but admin not found
- Different database has admin

**Solution:**
1. Check `application.properties` database URL
2. Verify connection: `SELECT DATABASE();`
3. Check if multiple databases exist
4. Ensure app connects to correct database

---

## 📊 DEBUG SQL QUERIES (All-in-One)

**Run this complete diagnostic script:**

```sql
-- ============================================
-- COMPLETE DIAGNOSTIC SCRIPT
-- ============================================

-- 1. Check database
SELECT DATABASE() AS current_database;

-- 2. Check if users table exists
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN 'EXISTS'
        ELSE 'NOT EXISTS'
    END AS users_table_status
FROM information_schema.tables 
WHERE table_schema = DATABASE() 
  AND table_name = 'users';

-- 3. Check Flyway migration status
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN 'EXISTS'
        ELSE 'NOT EXISTS'
    END AS flyway_table_status
FROM information_schema.tables 
WHERE table_schema = DATABASE() 
  AND table_name = 'flyway_schema_history';

-- 4. Check migration history
SELECT 
    version,
    description,
    script,
    installed_on,
    success
FROM flyway_schema_history
ORDER BY installed_rank;

-- 5. Check all users
SELECT 
    id,
    full_name,
    mobile_number,
    email,
    role,
    is_active,
    created_at
FROM users;

-- 6. Check admin user specifically
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

-- 7. Check role values
SELECT DISTINCT role FROM users;

-- 8. Check if admin exists by mobile only
SELECT * FROM users WHERE mobile_number = '9389110115';

-- 9. Check if admin exists by email only
SELECT * FROM users WHERE email = 'harshg101999@gmail.com';
```

---

## ✅ CONFIRMATION CHECKLIST

After applying fixes, verify:

- [ ] `flyway_schema_history` table exists
- [ ] Migration `V1__seed_admin_user.sql` is recorded
- [ ] `users` table exists
- [ ] Admin user exists: `SELECT * FROM users WHERE mobile_number = '9389110115'`
- [ ] Role is correct: `role = 'ADMIN'`
- [ ] User is active: `is_active = 1`
- [ ] OTP send works: `POST /api/v1/auth/admin/otp/send`
- [ ] OTP verify works: `POST /api/v1/auth/admin/otp/verify`
- [ ] JWT token is returned
- [ ] Login successful

---

**END OF DEBUG GUIDE**

