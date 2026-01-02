# Network Error Fix Summary - Admin App

## Issues Fixed

### 1. ✅ Android Network Security Configuration
- **Problem**: Android 9+ blocks cleartext HTTP traffic by default
- **Solution**: Created `network_security_config.xml` to allow HTTP connections for development
- **Location**: `android/app/src/main/res/xml/network_security_config.xml`

### 2. ✅ AndroidManifest.xml Updated
- **Problem**: AndroidManifest wasn't configured to allow cleartext traffic
- **Solution**: Added `android:networkSecurityConfig` and `android:usesCleartextTraffic="true"` attributes
- **Location**: `android/app/src/main/AndroidManifest.xml`

### 3. ✅ API Configuration Documentation
- **Problem**: API base URL configuration needed better documentation
- **Solution**: Added comprehensive comments explaining how to configure for different environments
- **Location**: `src/config/api.ts`

## Next Steps

### Step 1: Configure API Base URL

The API base URL is currently set to `http://10.0.2.2:8080/api/v1` (Android emulator).

**For Android Emulator** (default - no changes needed):
- Uses: `http://10.0.2.2:8080/api/v1`

**For Physical Device** (you need to change this):
1. Find your computer's IP address:
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" (usually starts with 192.168.x.x or 10.x.x.x)

2. Update `src/config/api.ts`:
   ```typescript
   BASE_URL: __DEV__
     ? 'http://YOUR_IP_ADDRESS:8080/api/v1' // Replace YOUR_IP_ADDRESS with your actual IP
     : 'https://your-production-api.com/api/v1',
   ```

3. **Important**: Make sure your phone and computer are on the same WiFi network!

### Step 2: Ensure Backend is Running

Make sure your Spring Boot backend is running on port 8080:

```powershell
cd backend
mvn spring-boot:run
```

Wait for: `Started ShivDhabaFoodDeliveryApplication in X.XXX seconds`

### Step 3: Test Backend Connection

Test if backend is accessible:
- From browser: `http://localhost:8080/api/v1/auth/admin/otp/send`
- From device browser: `http://YOUR_IP_ADDRESS:8080/api/v1/auth/admin/otp/send`

### Step 4: Rebuild the App

After making changes, rebuild the Android app:

```powershell
cd admin-app/android
./gradlew clean
cd ..
npx react-native run-android
```

Or if using Metro bundler:
- Press `R` twice in Metro bundler to reload
- Or shake device → Reload

### Step 5: Check Firewall (if still not working)

If connection still fails, check Windows Firewall:

```powershell
# Run as Administrator
netsh advfirewall firewall add rule name="Spring Boot 8080 Inbound" dir=in action=allow protocol=TCP localport=8080
```

## Common Issues

### Issue: "Network Error" or "ERR_NETWORK"
**Solutions:**
1. ✅ Backend is running? Check `netstat -an | findstr :8080`
2. ✅ Correct IP address in `api.ts`?
3. ✅ Device and computer on same WiFi?
4. ✅ Firewall allows port 8080?
5. ✅ Rebuilt app after changes?

### Issue: "Cleartext HTTP traffic not permitted"
**Solution:** ✅ Fixed! Network security config is now in place. Rebuild the app.

### Issue: Connection timeout
**Solutions:**
- Check backend is running
- Verify IP address is correct
- Check firewall settings
- Ensure same WiFi network

## Files Modified

1. `android/app/src/main/res/xml/network_security_config.xml` (NEW)
2. `android/app/src/main/AndroidManifest.xml` (UPDATED)
3. `src/config/api.ts` (UPDATED - comments added)

## Verification Checklist

- [ ] Backend is running on port 8080
- [ ] API base URL is configured correctly in `src/config/api.ts`
- [ ] Device and computer are on same WiFi network
- [ ] App has been rebuilt after changes
- [ ] Can access backend from device browser
- [ ] Windows Firewall allows port 8080 (if needed)

---

**Note**: After making any changes to `api.ts` or Android configuration files, you must rebuild the app for changes to take effect.


