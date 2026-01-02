# 🗄️ Flyway Admin User Migration Guide

## 📋 Overview

This document explains the Flyway migration that seeds the initial admin user into the database. This is a **one-time setup** that runs automatically when the Spring Boot application starts.

---

## 📁 File Location

**Migration File**: `backend/src/main/resources/db/migration/V1__seed_admin_user.sql`

**Naming Convention**: `V{version}__{description}.sql`
- `V1` = Version 1 (first migration)
- `__` = Separator (double underscore)
- `seed_admin_user` = Description

---

## 🔧 Setup Steps

### 1. Add Flyway Dependencies (Already Added)

The following dependencies have been added to `pom.xml`:
```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-mysql</artifactId>
</dependency>
```

### 2. Configure Flyway (Already Configured)

Added to `application.properties`:
```properties
# Flyway Configuration
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
spring.flyway.baseline-on-migrate=true
spring.flyway.validate-on-migrate=true
spring.flyway.clean-disabled=true
```

### 3. Hibernate DDL Auto Changed

Changed from `update` to `validate` to prevent conflicts:
```properties
spring.jpa.hibernate.ddl-auto=validate
```

**Why?** Flyway manages schema changes, so Hibernate should only validate, not create/modify tables.

---

## 👤 Admin User Details

| Field | Value |
|-------|-------|
| **Full Name** | System Admin |
| **Mobile Number** | 9389110115 |
| **Email** | harshg101999@gmail.com |
| **Role** | ADMIN |
| **is_active** | true |
| **password_hash** | NULL (OTP-based login) |

---

## 🔒 Security Features

### ✅ Idempotent Migration

The migration uses `WHERE NOT EXISTS` to ensure:
- **Safe to run multiple times** - Won't create duplicates
- **Checks both mobile_number and email** - Prevents conflicts
- **No errors on re-run** - Gracefully skips if admin exists

### ✅ SQL Logic

```sql
INSERT INTO users (...)
SELECT ...
WHERE NOT EXISTS (
    SELECT 1 
    FROM users 
    WHERE mobile_number = '9389110115' 
       OR email = 'harshg101999@gmail.com'
);
```

**How it works:**
1. Checks if user with mobile `9389110115` exists
2. Checks if user with email `harshg101999@gmail.com` exists
3. Only inserts if **neither** exists
4. If either exists, INSERT is skipped (no error)

---

## 🚀 Execution Flow

### On Application Startup

1. **Spring Boot starts**
2. **Flyway initializes** (if enabled)
3. **Checks `flyway_schema_history` table**
   - If table doesn't exist → creates it
   - If exists → reads migration history
4. **Scans `db/migration/` directory**
5. **Finds `V1__seed_admin_user.sql`**
6. **Checks if already executed**
   - If NOT executed → runs migration
   - If executed → skips (idempotent)
7. **Records migration in `flyway_schema_history`**
8. **Application continues startup**

### Migration Execution

```
[INFO] Flyway Community Edition 10.x.x by Redgate
[INFO] Database: jdbc:mysql://localhost:3306/food_delivery_db
[INFO] Successfully validated 1 migration (execution time 00:00.012s)
[INFO] Current version of schema `food_delivery_db`: << Empty Schema >>
[INFO] Migrating schema `food_delivery_db` to version "1 - seed admin user"
[INFO] Successfully applied 1 migration to schema `food_delivery_db` (execution time 00:00.045s)
```

---

## ✅ Verification Steps

### 1. Check Migration Status

**Via Database:**
```sql
SELECT * FROM flyway_schema_history;
```

Expected output:
```
installed_rank | version | description        | type | script                    | installed_on          | success
1              | 1       | seed admin user   | SQL  | V1__seed_admin_user.sql  | 2024-01-02 10:30:00   | 1
```

### 2. Verify Admin User Created

```sql
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
```

Expected output:
```
id | full_name    | mobile_number | email                    | role  | is_active | created_at
1  | System Admin | 9389110115    | harshg101999@gmail.com  | ADMIN | 1         | 2024-01-02 10:30:00
```

### 3. Test OTP Login

1. **Send OTP:**
   ```bash
   POST /api/v1/auth/admin/otp/send
   {
     "emailOrPhone": "9389110115"
   }
   ```

2. **Verify OTP:**
   ```bash
   POST /api/v1/auth/admin/otp/verify
   {
     "emailOrPhone": "9389110115",
     "otp": "123456"
   }
   ```

3. **Expected:** JWT token returned, login successful

---

## 🔄 What Happens on App Restart?

### First Startup (Fresh Database)
1. ✅ Flyway creates `flyway_schema_history` table
2. ✅ Executes `V1__seed_admin_user.sql`
3. ✅ Creates admin user
4. ✅ Records migration in history

### Subsequent Startups
1. ✅ Flyway checks `flyway_schema_history`
2. ✅ Sees `V1__seed_admin_user.sql` already executed
3. ✅ **Skips migration** (idempotent)
4. ✅ Admin user already exists (no duplicate)

### If Admin Already Exists
1. ✅ Migration runs (idempotent)
2. ✅ `WHERE NOT EXISTS` prevents duplicate
3. ✅ No error, no duplicate user
4. ✅ Migration marked as successful

---

## 🛡️ Production Safety

### ✅ Safe Practices

1. **Idempotent Design**
   - Can run multiple times safely
   - No side effects on re-execution

2. **No Duplicate Prevention**
   - Checks both mobile and email
   - Respects unique constraints

3. **No API Exposure**
   - Admin creation is NOT exposed via API
   - Only via database migration

4. **Version Control**
   - Migration file is in Git
   - Tracked and auditable

5. **Validation Enabled**
   - `validate-on-migrate=true`
   - Ensures migration integrity

### ⚠️ Important Notes

1. **Hibernate DDL Auto = validate**
   - Changed from `update` to `validate`
   - Prevents Hibernate from modifying schema
   - Flyway manages all schema changes

2. **Clean Disabled**
   - `clean-disabled=true`
   - Prevents accidental database drops
   - Production safety

3. **Baseline on Migrate**
   - `baseline-on-migrate=true`
   - Handles existing databases gracefully

---

## 📝 Adding More Migrations

### Future Migrations

To add more migrations, follow the naming convention:

```
V2__add_delivery_boy_table.sql
V3__add_order_tracking.sql
V4__update_user_permissions.sql
```

**Rules:**
- Version number must be **sequential** (V1, V2, V3...)
- Use **double underscore** `__` as separator
- Use **descriptive names** (lowercase, underscores)
- Place in `src/main/resources/db/migration/`

---

## 🐛 Troubleshooting

### Issue: Migration Not Running

**Check:**
1. Flyway enabled? `spring.flyway.enabled=true`
2. Correct location? `spring.flyway.locations=classpath:db/migration`
3. File naming correct? `V1__seed_admin_user.sql`
4. Database connection working?

### Issue: Duplicate Admin User

**Solution:**
- Migration is idempotent, but if duplicate exists:
```sql
DELETE FROM users 
WHERE mobile_number = '9389110115' 
  AND id NOT IN (
    SELECT MIN(id) FROM users 
    WHERE mobile_number = '9389110115'
  );
```

### Issue: Migration Failed

**Check logs:**
```
[ERROR] Migration of schema `food_delivery_db` to version "1 - seed admin user" failed!
```

**Common causes:**
- Database connection issue
- Table `users` doesn't exist (run Hibernate first, then Flyway)
- Syntax error in SQL

---

## 📚 References

- [Flyway Documentation](https://flywaydb.org/documentation/)
- [Spring Boot Flyway Integration](https://docs.spring.io/spring-boot/docs/current/reference/html/howto.html#howto.data-initialization.migration-tool.flyway)

---

## ✅ Summary

- ✅ **Migration File**: `V1__seed_admin_user.sql`
- ✅ **Location**: `src/main/resources/db/migration/`
- ✅ **Idempotent**: Safe to run multiple times
- ✅ **Production Ready**: No duplicates, no API exposure
- ✅ **Auto-executes**: Runs on application startup
- ✅ **Tracked**: Recorded in `flyway_schema_history`

**Admin can now login via OTP using:**
- Mobile: `9389110115`
- Email: `harshg101999@gmail.com`

---

**END OF DOCUMENTATION**

