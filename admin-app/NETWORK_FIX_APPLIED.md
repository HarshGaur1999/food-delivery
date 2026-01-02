# Network Connection Issue - Fix Applied ✅

## Issue
The Android app was unable to connect to the backend server at `http://10.0.2.2:8080/api/v1`, showing `ERR_NETWORK` errors with connection timeouts.

## Root Cause
The network security configuration was correct, but the Android app needed to be rebuilt to apply the network security config changes. Android caches security configurations and requires a clean rebuild for changes to take effect.

## Fixes Applied

### 1. Enhanced Network Security Config
Updated `android/app/src/main/res/xml/network_security_config.xml`:
- Added user certificates to trust-anchors for better compatibility
- Added explicit `127.0.0.1` domain configuration
- Maintained cleartext traffic permissions for all development IPs

### 2. Verified Configuration
- ✅ AndroidManifest.xml properly references network security config
- ✅ `usesCleartextTraffic="true"` is set
- ✅ INTERNET permission is declared
- ✅ Backend server is running on port 8080 and accessible

## Next Steps - REBUILD REQUIRED

You **MUST** rebuild the Android app for the changes to take effect:

### Option 1: Clean Rebuild (Recommended)
```powershell
cd admin-app

# Stop Metro bundler if running (Ctrl+C)

# Clean build
cd android
.\gradlew.bat clean
cd ..

# Start Metro bundler in one terminal
npx react-native start --reset-cache

# In another terminal, rebuild and run
npx react-native run-android
```

### Option 2: Use the Rebuild Script
```powershell
cd admin-app
.\rebuild-android.ps1
```

### Option 3: Full Clean (If Option 1 doesn't work)
```powershell
cd admin-app

# Clean everything
cd android
.\gradlew.bat clean
Remove-Item -Recurse -Force .\app\build
cd ..

# Clear Metro cache
npx react-native start --reset-cache &
# Wait a few seconds, then:
npx react-native run-android
```

## Verification

After rebuilding, the app should be able to:
- ✅ Connect to backend at `http://10.0.2.2:8080/api/v1`
- ✅ Send OTP requests without network errors
- ✅ Complete authentication flows

## Backend Status
- ✅ Backend is running on port 8080
- ✅ Server is bound to `0.0.0.0` (accessible from emulator)
- ✅ CORS is configured correctly

## Troubleshooting

If you still see network errors after rebuilding:

1. **Verify backend is running:**
   ```powershell
   netstat -ano | findstr :8080
   ```

2. **Test backend endpoint manually:**
   ```powershell
   Invoke-WebRequest -Uri "http://localhost:8080/api/v1/auth/admin/otp/send" -Method POST -ContentType "application/json" -Body '{"phoneNumber":"1234567890"}'
   ```

3. **Check Android emulator network:**
   - Ensure emulator is running
   - Try restarting the emulator
   - Verify emulator can access internet

4. **Check firewall:**
   - Windows Firewall should allow connections on port 8080
   - Antivirus software should not block localhost connections

## Notes

- The `10.0.2.2` IP address is the special Android emulator address that maps to `localhost` on your host machine
- For physical devices, you'll need to use your computer's actual IP address instead of `10.0.2.2`
- The network security config allows cleartext (HTTP) traffic for development only


