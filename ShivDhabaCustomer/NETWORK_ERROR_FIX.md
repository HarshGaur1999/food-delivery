# Network Error Fix - Complete Troubleshooting Guide

## Current Issue
```
ERROR: Network Error
URL: http://192.168.29.104:8080/api/v1/public/menu
Error Code: ERR_NETWORK
```

## Root Cause Analysis

### ✅ Verified:
- IP Address: `192.168.29.104` is correct
- Network Security Config: Updated with correct IP
- API Configuration: Correct

### ❌ Issue Found:
- **Backend server is NOT running on port 8080**

## Solution Steps

### Step 1: Start the Backend Server

**Open a new terminal and run:**

```bash
cd backend
mvn spring-boot:run
```

**OR if using an IDE:**
- Open the backend project in your IDE
- Run the `ShivDhabaFoodDeliveryApplication` main class
- Wait for: `Started ShivDhabaFoodDeliveryApplication in X.XXX seconds`

**Verify backend is running:**
```powershell
netstat -an | findstr :8080
# Should show: LISTENING on port 8080
```

### Step 2: Test Backend in Browser

**Open browser on your computer and navigate to:**
```
http://192.168.29.104:8080/api/v1/public/menu
```

**Expected:** JSON response with menu data
**If error:** Backend is not accessible, check firewall

### Step 3: Check Windows Firewall

**Allow port 8080 in Windows Firewall:**

```powershell
# Run as Administrator
netsh advfirewall firewall add rule name="Spring Boot 8080" dir=in action=allow protocol=TCP localport=8080
```

**OR manually:**
1. Open Windows Defender Firewall
2. Advanced Settings
3. Inbound Rules → New Rule
4. Port → TCP → 8080
5. Allow the connection

### Step 4: Rebuild Android App (If Network Config Changed)

**Since we updated network_security_config.xml, rebuild the app:**

```bash
cd ShivDhabaCustomer
cd android
./gradlew clean
cd ..
npx react-native run-android
```

**OR using npm:**
```bash
cd ShivDhabaCustomer
npm run android
```

### Step 5: Verify Device Network

**Ensure:**
- ✅ Device and computer are on **same WiFi network**
- ✅ WiFi SSID matches on both devices
- ✅ Device can access internet (test in browser)

**Test on device browser:**
- Open browser on Android device
- Navigate to: `http://192.168.29.104:8080/api/v1/public/menu`
- Should see JSON response

## Quick Diagnostic Commands

### Check Backend Status:
```powershell
netstat -an | findstr :8080
```

### Check Current IP:
```powershell
ipconfig | findstr "IPv4"
```

### Test Backend Locally:
```powershell
curl http://localhost:8080/api/v1/public/menu
```

### Test Backend from Network:
```powershell
curl http://192.168.29.104:8080/api/v1/public/menu
```

## Common Issues & Solutions

### Issue 1: Backend Starts But Can't Connect
**Solution:**
- Check `application.properties` has: `server.address=0.0.0.0`
- This allows connections from network, not just localhost

### Issue 2: Firewall Blocking
**Solution:**
- Add firewall rule (see Step 3)
- Or temporarily disable firewall for testing

### Issue 3: IP Address Changed
**Solution:**
- Run: `ipconfig | findstr "IPv4"`
- Update `api.js` with new IP
- Update `network_security_config.xml` with new IP
- Rebuild app

### Issue 4: Device Not on Same Network
**Solution:**
- Connect device to same WiFi as computer
- Verify WiFi SSID matches

### Issue 5: Android Emulator Network Issue
**Solution:**
- For Android Emulator, use: `http://10.0.2.2:8080/api/v1`
- This is the special IP for emulator to access host machine

## Testing Checklist

- [ ] Backend is running (`netstat` shows port 8080 LISTENING)
- [ ] Backend accessible in browser on computer
- [ ] Backend accessible in browser on device
- [ ] Windows Firewall allows port 8080
- [ ] Device and computer on same WiFi
- [ ] IP address correct in `api.js`
- [ ] Network security config updated
- [ ] App rebuilt after config changes

## Expected Success Indicators

After fixing, you should see:
```
✅ API Request: GET http://192.168.29.104:8080/api/v1/public/menu
✅ API Response: 200
✅ Menu data loading successfully
```

## Still Having Issues?

1. **Check backend logs** for errors
2. **Verify MySQL is running** (backend needs database)
3. **Check backend console** for startup errors
4. **Try different IP** if network changed
5. **Restart both backend and app**

---

**Status:** ⚠️ Backend not running - Start backend first!
