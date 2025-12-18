# Menu Fetch Issue - Complete Fix Guide

## Problem
Menu fetch nahi ho raha hai (Menu is not fetching)

## Fixes Applied

### 1. ✅ Android Network Security Configuration
- Created `network_security_config.xml` to allow HTTP traffic
- Updated `AndroidManifest.xml` to use the network security config
- This fixes Android 9+ blocking cleartext HTTP traffic

### 2. ✅ Enhanced Error Handling
- Added detailed error messages in `menuService.js`
- Added comprehensive logging for debugging
- Improved error messages for network issues

### 3. ✅ Response Structure Handling
- Fixed response parsing in `menuSlice.js`
- Handles backend ApiResponse format correctly

## Current API Configuration

**File:** `src/config/api.js`
```javascript
const API_BASE_URL = 'http://10.164.155.177:8080/api/v1';
```

## Troubleshooting Steps

### Step 1: Check Backend Server Status

**Windows (PowerShell):**
```powershell
# Check if backend is running on port 8080
netstat -an | findstr :8080

# Test API endpoint
Invoke-WebRequest -Uri "http://10.164.155.177:8080/api/v1/public/menu" -Method GET
```

**Or use curl:**
```powershell
curl http://localhost:8080/api/v1/public/menu
```

### Step 2: Verify IP Address

**If using Android Emulator:**
- Change `API_BASE_URL` to: `http://10.0.2.2:8080/api/v1`

**If using Physical Device:**
1. Find your computer's IP address:
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" under your active network adapter

2. Update `src/config/api.js`:
   ```javascript
   const API_BASE_URL = 'http://YOUR_IP_ADDRESS:8080/api/v1';
   ```

3. Make sure your phone and computer are on the same WiFi network
4. Temporarily disable Windows Firewall or allow port 8080

**If using iOS Simulator:**
- Change `API_BASE_URL` to: `http://localhost:8080/api/v1`

### Step 3: Verify Backend is Running

**Start Backend Server:**
```bash
cd d:\food-delivery\backend
# If using Maven
mvn spring-boot:run
# Or if you have a script
./mvnw spring-boot:run
```

**Verify Backend Endpoint:**
- Open browser: `http://localhost:8080/api/v1/public/menu`
- Should return JSON with menu data

### Step 4: Check React Native Logs

**View logs in Metro:**
- Check Metro bundler console for error messages
- Look for:
  - "Menu API Error"
  - "fetchMenu thunk: Error caught"
  - "Cannot connect to server"

**View logs on device:**
```powershell
# Android
adb logcat | findstr "ReactNativeJS"

# Or use React Native debugger
# Shake device -> Debug -> Check console
```

### Step 5: Rebuild App

After making changes to AndroidManifest.xml:
```powershell
cd d:\food-delivery\ShivDhabaCustomer\android
.\gradlew clean
cd ..
npx react-native run-android
```

## Common Issues & Solutions

### Issue 1: "Cannot connect to server"
**Solution:**
- Backend server is not running → Start backend
- Wrong IP address → Check and update IP
- Firewall blocking → Allow port 8080 in firewall
- Device not on same network → Connect to same WiFi

### Issue 2: "Menu endpoint not found (404)"
**Solution:**
- Check API URL path is correct: `/api/v1/public/menu`
- Verify backend controller mapping
- Check if backend is running correct version

### Issue 3: "Network request failed"
**Solution:**
- Android: Network security config is applied (already done)
- Check internet permission in AndroidManifest (already present)
- Verify device has internet connection

### Issue 4: Empty menu data
**Solution:**
- Backend might have no menu items in database
- Check backend logs for errors
- Verify database connection in backend

## Testing the Fix

1. **Start Backend:**
   ```bash
   cd d:\food-delivery\backend
   mvn spring-boot:run
   ```

2. **Update IP in api.js** (if needed for your setup)

3. **Rebuild App:**
   ```powershell
   cd d:\food-delivery\ShivDhabaCustomer
   npx react-native run-android
   ```

4. **Check Logs:**
   - Open Metro console
   - Navigate to Menu screen in app
   - Check for console logs:
     - "Fetching menu from: /public/menu"
     - "Menu API Response Status: 200"
     - "Menu data extracted successfully"

## Quick IP Address Update

**File:** `src/config/api.js`

**For Android Emulator:**
```javascript
const API_BASE_URL = 'http://10.0.2.2:8080/api/v1';
```

**For Physical Device (replace with your IP):**
```javascript
const API_BASE_URL = 'http://192.168.1.XXX:8080/api/v1'; // Your computer's IP
```

**For iOS Simulator:**
```javascript
const API_BASE_URL = 'http://localhost:8080/api/v1';
```

## Files Modified

1. ✅ `android/app/src/main/res/xml/network_security_config.xml` (created)
2. ✅ `android/app/src/main/AndroidManifest.xml` (updated)
3. ✅ `src/services/menuService.js` (enhanced error handling)
4. ✅ `src/store/slices/menuSlice.js` (improved response handling)

## Next Steps

1. ✅ Verify backend is running
2. ✅ Update IP address if needed
3. ✅ Rebuild app
4. ✅ Check console logs for specific error
5. ✅ Test menu fetch

If issue persists, check Metro console logs and share the error message for further debugging.

