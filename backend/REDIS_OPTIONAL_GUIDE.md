# Redis Usage Guide - Is Redis Compulsory?

## Short Answer: **NO, Redis is NOT compulsory for Menu Fetching**

## Detailed Explanation

### Where Redis is Used:

1. **Menu Caching** (`MenuService`)
   - ✅ **OPTIONAL** - Only for performance optimization
   - Menu fetching will work without Redis
   - Changed to use `simple` cache (in-memory) instead

2. **OTP Authentication** (`AuthService`)
   - ⚠️ **REQUIRED** - Only if you want to use OTP-based authentication
   - Menu endpoint is PUBLIC and doesn't need authentication
   - So menu fetching works WITHOUT Redis

### Current Configuration

**File:** `application.properties`

```properties
# Using simple in-memory cache (NO Redis needed for menu)
spring.cache.type=simple

# Redis config is commented out
# Uncomment only if you need OTP authentication
# spring.data.redis.host=localhost
# spring.data.redis.port=6379
```

## For Menu Fetching Only (No Redis Needed)

✅ **Menu fetching works perfectly without Redis** because:
- Menu endpoint (`/api/v1/public/menu`) is public (no auth needed)
- Menu caching uses simple in-memory cache (not Redis)
- No Redis connection required

**Just start your backend and menu will fetch!**

```bash
cd backend
mvn spring-boot:run
```

## When You DO Need Redis

Redis is only required if you want to use **OTP Authentication**:

1. **Uncomment Redis config** in `application.properties`:
   ```properties
   spring.data.redis.host=localhost
   spring.data.redis.port=6379
   spring.data.redis.password=
   spring.cache.type=redis
   ```

2. **Start Redis server:**
   ```bash
   # Windows (if installed)
   redis-server
   
   # Or using Docker
   docker run -d -p 6379:6379 redis:latest
   ```

3. Restart backend

## Quick Setup for Menu Fetching (Without Redis)

**Current setup already configured to work WITHOUT Redis!**

1. ✅ Cache type is set to `simple` (in-memory)
2. ✅ Menu endpoint is public (no auth)
3. ✅ MenuService uses @Cacheable (works with simple cache)

**Just start backend:**
```bash
cd backend
mvn spring-boot:run
```

**Menu will fetch successfully!** ✅

## Troubleshooting

### If backend fails to start:

**Error:** `Cannot connect to Redis`

**Solution:** 
- Redis config is already commented out
- Cache type is set to `simple`
- Backend should start fine

**Error:** `AuthService requires RedisTemplate`

**Solution:**
- This only happens if you uncomment Redis config but Redis is not running
- For menu fetching, you don't need AuthService
- Keep Redis config commented out

## Summary

| Feature | Redis Required? | Status |
|---------|----------------|--------|
| Menu Fetching | ❌ NO | ✅ Works without Redis |
| Menu Caching | ❌ NO | ✅ Uses simple cache |
| OTP Authentication | ✅ YES | ⚠️ Only if you use it |

**For Menu Fetching: Redis is NOT compulsory! ✅**

