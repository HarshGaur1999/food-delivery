# Network Error Logging Guide

## Overview
Comprehensive logging has been added throughout the admin app to help diagnose network errors. All logs are prefixed with emoji icons for easy identification in the console.

## Log Categories

### 🚀 App Initialization Logs
**Location**: `src/app.tsx`
- Shows API configuration on app startup
- Displays BASE_URL, timeout, and platform info

### 🔧 API Client Logs
**Location**: `src/services/apiClient.ts`

**Request Logs** (📤):
- HTTP method and full URL
- Request headers
- Request body/data

**Response Logs** (✅):
- HTTP status code
- Full URL
- Response data

**Error Logs** (❌):
- HTTP status code and status text
- Error message and code
- Full response data
- Network error diagnostics with possible causes

### 🔐 Auth Repository Logs
**Location**: `src/data/repositories/authRepository.ts`
- Function calls (login, sendAdminOtp, verifyAdminOtp)
- Request data
- Endpoint URLs
- Success/failure status

### 📱 Auth Store Logs
**Location**: `src/store/authStore.ts`
- State changes
- Function calls
- Error details with full error object breakdown

### 🖥️ Login Screen Logs
**Location**: `src/presentation/screens/LoginScreen.tsx`
- User interactions
- Input validation
- Navigation events
- Detailed error messages for alerts

## How to Use Logs to Diagnose Issues

### Step 1: Check App Startup
Look for:
```
🚀 [App] Starting Admin App...
🔧 [App] API Configuration: { BASE_URL: '...', TIMEOUT: 30000, ... }
```

**Verify**: BASE_URL is correct for your setup (emulator vs physical device)

### Step 2: Monitor Login Attempt
When you tap "Send OTP", look for this sequence:

1. **LoginScreen**:
   ```
   🖥️ [LoginScreen] handleSendOtp() called with: <email/phone>
   🖥️ [LoginScreen] Calling sendAdminOtp...
   ```

2. **AuthStore**:
   ```
   📱 [AuthStore] sendAdminOtp() called with: <email/phone>
   ```

3. **AuthRepository**:
   ```
   🔐 [AuthRepository] sendAdminOtp() called
   🔐 [AuthRepository] Request: { emailOrPhone: "..." }
   🔐 [AuthRepository] Endpoint: /auth/admin/otp/send
   ```

4. **API Client Request**:
   ```
   📤 [API Request] POST http://10.0.2.2:8080/api/v1/auth/admin/otp/send
   📤 [API Request] Headers: { ... }
   📤 [API Request] Body: { ... }
   ```

### Step 3: Check for Errors

**If request succeeds**, you'll see:
```
✅ [API Response] 200 POST http://...
✅ [API Response] Data: { ... }
✅ [AuthRepository] sendAdminOtp() success
✅ [AuthStore] sendAdminOtp() success
✅ [LoginScreen] sendAdminOtp succeeded
```

**If request fails**, look for:

#### Network Error (No Response)
```
❌ [API Error] POST http://...
❌ [API Error] Status: undefined
❌ [API Error] No response received - Network Error
❌ [API Error] Possible causes:
   - Backend server not running
   - Wrong IP address/URL in API_CONFIG
   - Device not on same network as backend
   - Firewall blocking connection
   - Timeout exceeded
```

#### HTTP Error (Response Received)
```
❌ [API Error] POST http://...
❌ [API Error] Status: 404 (or 500, 401, etc.)
❌ [API Error] Status Text: Not Found
❌ [API Error] Response Data: { ... }
```

#### Timeout Error
```
❌ [API Error] Error Code: ECONNABORTED
❌ [API Error] Error Message: timeout of 30000ms exceeded
```

## Common Error Patterns

### Pattern 1: Backend Not Running
```
❌ [API Error] No response received - Network Error
```
**Solution**: Start the backend server

### Pattern 2: Wrong IP Address
```
❌ [API Error] No response received - Network Error
🔧 [App] API Configuration: { BASE_URL: 'http://10.0.2.2:8080/api/v1' }
```
**If using physical device**: Change BASE_URL to your computer's IP address

### Pattern 3: Firewall Blocking
```
❌ [API Error] No response received - Network Error
```
**Solution**: Check Windows Firewall, allow port 8080

### Pattern 4: Wrong Endpoint
```
❌ [API Error] Status: 404
❌ [API Error] Status Text: Not Found
```
**Solution**: Verify endpoint path matches backend API

### Pattern 5: CORS or Network Security
```
❌ [API Error] Error Code: ERR_NETWORK
```
**Solution**: Check network security config (already fixed), ensure backend allows CORS

## Where to View Logs

### React Native Debugger
- Open React Native Debugger
- Check Console tab

### Metro Bundler Terminal
- Look in the terminal where you ran `npx react-native start`
- Logs appear in real-time

### Android Logcat
```bash
adb logcat | grep -E "\[App\]|\[API|\[Auth|\[Login"
```

### Chrome DevTools (if using Remote JS Debugging)
- Open Chrome DevTools
- Check Console tab

## Quick Diagnostic Checklist

When you see a network error, check logs for:

- [ ] ✅ API_CONFIG.BASE_URL is correct
- [ ] ✅ Request URL is constructed correctly
- [ ] ✅ Backend endpoint exists (check status code)
- [ ] ✅ Request headers are correct
- [ ] ✅ Request body is correct
- [ ] ✅ Network error vs HTTP error
- [ ] ✅ Timeout vs connection refused
- [ ] ✅ Error response data from backend

## Next Steps After Reviewing Logs

1. **Copy the full error log** from console
2. **Check the BASE_URL** - is it correct for your setup?
3. **Verify backend is running** - can you access it from browser?
4. **Check network connectivity** - same WiFi? Firewall?
5. **Verify endpoint** - does it match backend API?

---

**All logs are prefixed with category icons for easy filtering and identification.**


