# 🚨 Quick Fix: Network Error

## Problem
```
ERROR: Network Error
URL: http://192.168.29.104:8080/api/v1/public/menu
Error Code: ERR_NETWORK
```

## ⚡ Quick Solution (3 Steps)

### Step 1: Start Backend Server

**Option A: Double-click the batch file (Easiest)**
```
Navigate to: d:\food-delivery\backend\
Double-click: start-backend.bat
```

**Option B: Run PowerShell script**
```powershell
cd d:\food-delivery\backend
.\start-backend.ps1
```

**Option C: Manual command**
```powershell
cd d:\food-delivery\backend
mvn spring-boot:run
```

**Wait for this message:**
```
Started ShivDhabaFoodDeliveryApplication in X.XXX seconds
```

### Step 2: Verify Backend is Running

**Open a NEW terminal/PowerShell and run:**
```powershell
netstat -an | findstr :8080
```

**Should show:**
```
TCP    0.0.0.0:8080           0.0.0.0:0              LISTENING
```

**Test in browser:**
```
http://192.168.29.104:8080/api/v1/public/menu
```
Should return JSON menu data.

### Step 3: Restart React Native App

**In your React Native terminal:**
- Press `R` twice to reload
- OR shake device → Reload
- OR restart: `npx react-native run-android`

## ✅ Success Indicators

After starting backend, you should see:
```
✅ API Request: GET http://192.168.29.104:8080/api/v1/public/menu
✅ API Response: 200
✅ Menu data loading successfully
```

## 🔧 If Backend Won't Start

### Check Prerequisites:

1. **Java 17+ installed:**
   ```powershell
   java -version
   ```

2. **Maven installed:**
   ```powershell
   mvn -version
   ```

3. **MySQL running:**
   - MySQL should be running on port 3306
   - Database will be created automatically

### Common Errors:

**Error: Port 8080 already in use**
```powershell
# Find and kill process
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Error: Cannot connect to MySQL**
- Start MySQL service
- Check: `mysql -u root -p`

## 📝 Summary

1. ✅ Start backend: `cd backend && mvn spring-boot:run`
2. ✅ Verify: `netstat -an | findstr :8080`
3. ✅ Test: Open `http://192.168.29.104:8080/api/v1/public/menu` in browser
4. ✅ Restart React Native app

---

**The backend server MUST be running for the app to work!**
