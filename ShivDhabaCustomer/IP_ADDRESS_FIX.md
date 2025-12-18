# IP Address Fix - Network Error Solution

## Problem
```
ERROR  Menu API Error: [AxiosError: Network Error]
ERROR  Error Code: ERR_NETWORK
Error Request Base URL: http://10.164.155.177:8080/api/v1
```

## Root Cause
**Wrong IP Address in API Configuration**
- Config had: `10.164.155.177` ❌
- Actual IP: `192.168.29.104` ✅

## Solution Applied
✅ Updated `src/config/api.js` with correct IP address
✅ Updated `android/app/src/main/res/xml/network_security_config.xml` to include current IP
✅ Enhanced error logging for better diagnostics

## Important: Choose Correct IP Based on Your Setup

### 1. **Android Emulator** (AVD)
```javascript
const API_BASE_URL = 'http://10.0.2.2:8080/api/v1';
```

### 2. **Physical Android Device** (Same WiFi)
```javascript
// Use your computer's IP address
const API_BASE_URL = 'http://192.168.29.104:8080/api/v1';
// Find your IP: ipconfig (Windows) or ifconfig (Mac/Linux)
```

### 3. **iOS Simulator**
```javascript
const API_BASE_URL = 'http://localhost:8080/api/v1';
```

### 4. **Physical iOS Device** (Same WiFi)
```javascript
// Use your computer's IP address
const API_BASE_URL = 'http://192.168.29.104:8080/api/v1';
```

## Current Configuration
✅ IP Updated to: `192.168.29.104:8080`

## Next Steps

⚠️ **IMPORTANT: Rebuild Required**
Since we updated the Android network security config, you need to rebuild the app:

```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

**OR** if using npm scripts:
```bash
npm run android
```

After rebuild, you can reload normally:
- Shake device → Reload
- Or press `R` twice in Metro bundler

2. **Verify Backend is Running**:
   ```powershell
   netstat -an | findstr :8080
   # Should show: LISTENING on port 8080
   ```

3. **Check Firewall** (if still not working):
   - Windows Firewall might be blocking port 8080
   - Allow port 8080 in Windows Firewall
   - Or temporarily disable firewall for testing

4. **Verify Device and Computer on Same Network**:
   - Both must be on same WiFi network
   - Check WiFi SSID matches

## Testing the Fix

After reloading app, you should see:
- ✅ `API Request: GET http://192.168.29.104:8080/api/v1/public/menu`
- ✅ `API Response: 200`
- ✅ Menu data loading successfully

## If Still Getting Network Error

1. **Check if backend is accessible from device**:
   - Open browser on device
   - Navigate to: `http://192.168.29.104:8080/api/v1/public/menu`
   - Should see JSON response

2. **Verify IP address**:
   ```powershell
   ipconfig
   # Look for IPv4 Address under your active network adapter
   ```

3. **Check Firewall**:
   ```powershell
   # Allow port 8080 in Windows Firewall
   netsh advfirewall firewall add rule name="Spring Boot 8080" dir=in action=allow protocol=TCP localport=8080
   ```

## Quick IP Update Script

If your IP changes frequently, you can find it with:
```powershell
# Windows
ipconfig | findstr "IPv4"

# Then update api.js with the new IP
```

---

**Status:** ✅ IP Address Fixed
**Next:** Reload app and test menu fetch

