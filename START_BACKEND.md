# Quick Start - Backend Server

## Problem
Network Error: Cannot connect to `http://192.168.29.104:8080`

## Solution: Start the Backend Server

### Option 1: Using Maven (Command Line)

**Open PowerShell/Terminal in `backend` folder:**

```bash
cd backend
mvn spring-boot:run
```

**Wait for:**
```
Started ShivDhabaFoodDeliveryApplication in X.XXX seconds
```

### Option 2: Using IDE (IntelliJ IDEA / Eclipse)

1. Open `backend` folder in your IDE
2. Find: `src/main/java/com/shivdhaba/food_delivery/ShivDhabaFoodDeliveryApplication.java`
3. Right-click → Run
4. Wait for startup to complete

### Option 3: Using Gradle (if configured)

```bash
cd backend
./gradlew bootRun
```

## Verify Backend is Running

**In a new terminal, run:**
```powershell
netstat -an | findstr :8080
```

**Should show:**
```
TCP    0.0.0.0:8080           0.0.0.0:0              LISTENING
```

**Test in browser:**
```
http://localhost:8080/api/v1/public/menu
```

Should return JSON menu data.

## Prerequisites

Before starting backend, ensure:

1. **Java 17+ installed:**
   ```powershell
   java -version
   ```

2. **MySQL running:**
   - MySQL should be running on port 3306
   - Database: `food_delivery_db` (will be created automatically)
   - Username: `root`
   - Password: `admin`

3. **Maven installed:**
   ```powershell
   mvn -version
   ```

## Common Startup Errors

### Error: Port 8080 already in use
**Solution:**
```powershell
# Find process using port 8080
netstat -ano | findstr :8080
# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Error: Cannot connect to MySQL
**Solution:**
- Start MySQL service
- Check credentials in `application.properties`
- Verify MySQL is running: `mysql -u root -p`

### Error: Redis connection (if Redis config uncommented)
**Solution:**
- Redis is now optional - keep it commented out
- Or start Redis: `docker run -d -p 6379:6379 redis:latest`

## After Backend Starts

1. ✅ Backend running on `http://0.0.0.0:8080`
2. ✅ Accessible from network at `http://192.168.29.104:8080`
3. ✅ Test in browser: `http://192.168.29.104:8080/api/v1/public/menu`
4. ✅ Restart React Native app
5. ✅ Menu should load successfully

---

**Quick Command:**
```bash
cd backend && mvn spring-boot:run
```
