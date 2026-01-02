# Network Error Diagnostic & Fix Guide
## React Native Admin App → Spring Boot Backend (Android Emulator)

---

## ✅ VERIFICATION RESULTS

### 1. Backend Status: **RUNNING ✅**
- **Port 8080**: Listening on `0.0.0.0:8080` (confirmed via netstat)
- **Process ID**: 12608
- **Server Response**: Backend is responding (tested with localhost)
- **TCP Connection**: SUCCESS (Test-NetConnection confirmed)

### 2. Spring Boot Configuration: **CORRECT ✅**
```properties
server.port=8080
server.address=0.0.0.0  # ✅ Correct - allows external connections
```

### 3. Controller Endpoints: **EXIST ✅**
- ✅ `POST /api/v1/auth/admin/otp/send` - Found in `AuthController.java` (line 56)
- ✅ `GET /api/v1/admin/orders` - Found in `AdminController.java` (line 186)

### 4. CORS Configuration: **CORRECT ✅**
```java
configuration.setAllowedOrigins(List.of("*"));
configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
configuration.setAllowedHeaders(List.of("*"));
```
**Note**: CORS is for browsers. React Native doesn't use CORS, but this config won't harm.

### 5. Android Configuration: **CORRECT ✅**
- ✅ `network_security_config.xml` allows cleartext traffic
- ✅ `AndroidManifest.xml` references network security config
- ✅ `BASE_URL` set to `http://10.0.2.2:8080/api/v1` (correct for emulator)

---

## 🔍 ROOT CAUSE ANALYSIS

Based on the verification, **the backend is running correctly**, but the Android emulator is still unable to connect. The most likely causes are:

### Most Likely Root Cause: **Windows Firewall Blocking Port 8080**

Even though the server is bound to `0.0.0.0:8080`, Windows Firewall may be blocking incoming connections on port 8080 from the Android emulator (which appears as coming from `10.0.2.2`).

### Secondary Possibilities:
1. Backend binding issue (though netstat shows `0.0.0.0`)
2. Emulator network configuration issue
3. Backend not fully started (database connection pending, etc.)

---

## 🔧 STEP-BY-STEP FIX

### Step 1: Verify Backend is Fully Started

**Check if backend startup completed successfully:**

```powershell
# Navigate to backend directory
cd backend

# Check if there are any startup errors in logs
Get-Content target/app.log -Tail 100 | Select-String -Pattern "error|exception|failed" -Context 2
```

**Look for:**
- ✅ "Started ShivDhabaFoodDeliveryApplication" - Backend started successfully
- ❌ Database connection errors
- ❌ Port binding errors
- ❌ Bean creation errors

**If backend didn't start properly, check:**
```powershell
# Verify MySQL is running
Get-Service -Name MySQL* | Select-Object Name, Status

# If MySQL is not running, start it
Start-Service MySQL80  # Adjust service name if different
```

### Step 2: Add Windows Firewall Rule (CRITICAL FIX)

**Create firewall rule to allow port 8080:**

```powershell
# Run PowerShell as Administrator
# Allow inbound connections on port 8080

New-NetFirewallRule -DisplayName "Spring Boot API Port 8080" `
    -Direction Inbound `
    -LocalPort 8080 `
    -Protocol TCP `
    -Action Allow `
    -Profile Domain,Private,Public
```

**Alternative method (if above doesn't work):**
```powershell
netsh advfirewall firewall add rule name="Spring Boot API Port 8080" dir=in action=allow protocol=TCP localport=8080
```

**Verify rule was created:**
```powershell
Get-NetFirewallRule -DisplayName "Spring Boot API Port 8080" | Select-Object DisplayName, Enabled, Direction, Action
```

### Step 3: Verify Server Binding

**Double-check that server is bound to 0.0.0.0 (not just 127.0.0.1):**

```powershell
netstat -ano | findstr :8080
```

**Expected output:**
```
TCP    0.0.0.0:8080           0.0.0.0:0              LISTENING       <PID>
TCP    [::]:8080              [::]:0                 LISTENING       <PID>
```

If you see `127.0.0.1:8080` instead of `0.0.0.0:8080`, the server is only bound to localhost. Fix this in `application.properties`:
```properties
server.address=0.0.0.0
```

### Step 4: Test Connection from Host Machine

**Test that backend accepts connections on all interfaces:**

```powershell
# Test localhost connection
Invoke-WebRequest -Uri "http://localhost:8080/api/v1/public/menu" -Method GET -UseBasicParsing

# Test with 127.0.0.1
Invoke-WebRequest -Uri "http://127.0.0.1:8080/api/v1/public/menu" -Method GET -UseBasicParsing

# Test with your actual IP address (replace with your IP)
$myIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.254.*"}).IPAddress | Select-Object -First 1
Invoke-WebRequest -Uri "http://$myIP:8080/api/v1/public/menu" -Method GET -UseBasicParsing
```

All three should return a response (200 OK or valid error response).

### Step 5: Test Connection from Android Emulator

**From Android Emulator's browser (if available) or via adb:**

```powershell
# Using adb to test from emulator
adb shell "curl -v http://10.0.2.2:8080/api/v1/public/menu"
```

**Or use adb reverse port forwarding as a workaround:**
```powershell
# Forward emulator's port 8080 to host's port 8080
adb reverse tcp:8080 tcp:8080

# Then change BASE_URL in admin-app/src/config/api.ts to:
# BASE_URL: 'http://localhost:8080/api/v1'
```

### Step 6: Verify React Native App Configuration

**Double-check admin-app configuration:**

1. **Verify BASE_URL** in `admin-app/src/config/api.ts`:
```typescript
BASE_URL: __DEV__
  ? 'http://10.0.2.2:8080/api/v1'  // ✅ Correct for emulator
  : 'https://your-production-api.com/api/v1',
```

2. **Verify network security config** in `admin-app/android/app/src/main/AndroidManifest.xml`:
```xml
<application
  android:networkSecurityConfig="@xml/network_security_config"
  android:usesCleartextTraffic="true">
```

3. **Rebuild the Android app after any changes:**
```powershell
cd admin-app/android
.\gradlew clean
cd ..
npx react-native run-android
```

---

## 📋 COMMANDS TO RUN (Quick Reference)

### 1. Check Backend Status
```powershell
# Check if port 8080 is listening
netstat -ano | findstr :8080

# Check if backend process is running
Get-Process -Id <PID> -ErrorAction SilentlyContinue

# Test backend response
Invoke-WebRequest -Uri "http://localhost:8080/api/v1/public/menu" -Method GET -UseBasicParsing
```

### 2. Check Database Connection
```powershell
# Check MySQL service status
Get-Service -Name MySQL* | Select-Object Name, Status

# Start MySQL if not running
Start-Service MySQL80
```

### 3. Add Firewall Rule (Run as Administrator)
```powershell
New-NetFirewallRule -DisplayName "Spring Boot API Port 8080" `
    -Direction Inbound `
    -LocalPort 8080 `
    -Protocol TCP `
    -Action Allow `
    -Profile Domain,Private,Public
```

### 4. Test from Emulator
```powershell
# Test connection from emulator
adb shell "curl -v http://10.0.2.2:8080/api/v1/public/menu"

# Or use port forwarding
adb reverse tcp:8080 tcp:8080
```

### 5. Restart Backend (if needed)
```powershell
cd backend
mvn spring-boot:run
```

### 6. Rebuild React Native App
```powershell
cd admin-app/android
.\gradlew clean
cd ..
npx react-native run-android
```

---

## ✅ FINAL VERIFICATION CHECKLIST

Use this checklist to verify everything is working:

### Backend Verification
- [ ] Backend process is running (check Task Manager or `Get-Process`)
- [ ] Port 8080 is listening on `0.0.0.0:8080` (not `127.0.0.1:8080`)
- [ ] `server.address=0.0.0.0` in `application.properties`
- [ ] MySQL database is running and accessible
- [ ] Backend logs show "Started ShivDhabaFoodDeliveryApplication"
- [ ] Firewall rule for port 8080 is created and enabled
- [ ] `http://localhost:8080/api/v1/public/menu` returns a response

### Android App Verification
- [ ] `BASE_URL` is set to `http://10.0.2.2:8080/api/v1` in `admin-app/src/config/api.ts`
- [ ] `network_security_config.xml` allows cleartext traffic
- [ ] `AndroidManifest.xml` references network security config
- [ ] Android app is rebuilt after configuration changes
- [ ] Metro bundler is running
- [ ] Android emulator is running and fully loaded

### Network Verification
- [ ] Windows Firewall allows port 8080 (inbound rule created)
- [ ] Backend responds to `http://localhost:8080`
- [ ] Backend responds to `http://127.0.0.1:8080`
- [ ] Backend responds to `http://<your-ip>:8080` (optional, for physical devices)
- [ ] Emulator can reach `http://10.0.2.2:8080` (test with adb curl)

---

## 🎯 EXPECTED BEHAVIOR AFTER FIX

Once all fixes are applied:

1. **Backend**: Should be accessible from all network interfaces
2. **Android Emulator**: Should successfully connect to `http://10.0.2.2:8080/api/v1`
3. **API Calls**: Should complete without `ERR_NETWORK` errors
4. **Response**: Should receive actual HTTP responses (200, 400, 401, etc.) instead of network errors

---

## 🔄 IF STILL NOT WORKING

If the issue persists after following all steps:

### Option 1: Use ADB Reverse Port Forwarding (Workaround)
```powershell
# Forward emulator port to host port
adb reverse tcp:8080 tcp:8080

# Change BASE_URL in admin-app/src/config/api.ts to:
BASE_URL: 'http://localhost:8080/api/v1'
```

### Option 2: Use Your Computer's IP Address
```powershell
# Find your computer's IP address
ipconfig | findstr IPv4

# Use that IP in BASE_URL instead of 10.0.2.2
# Example: http://192.168.1.100:8080/api/v1
```

### Option 3: Check Antivirus/Firewall Software
- Temporarily disable third-party antivirus/firewall
- Check if any security software is blocking Java/Spring Boot
- Add Java/Spring Boot executables to whitelist

### Option 4: Verify Emulator Network Settings
- Ensure emulator is using the correct network configuration
- Try creating a new emulator instance
- Check emulator's extended controls → Settings → Proxy

---

## 📝 SUMMARY

**Root Cause**: Most likely Windows Firewall blocking port 8080 from Android emulator.

**Primary Fix**: Add Windows Firewall rule to allow inbound connections on port 8080.

**Secondary Checks**: 
- Verify backend is bound to `0.0.0.0:8080`
- Ensure MySQL is running
- Confirm backend started without errors
- Verify Android app configuration

**Quick Fix Command** (Run PowerShell as Administrator):
```powershell
New-NetFirewallRule -DisplayName "Spring Boot API Port 8080" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow -Profile Domain,Private,Public
```

---

**Last Updated**: Based on diagnostic run at the time of issue investigation
**Backend Status**: ✅ Running on port 8080
**Configuration Status**: ✅ All configurations verified as correct

