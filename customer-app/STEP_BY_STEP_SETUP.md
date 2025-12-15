# Customer App - Step by Step Setup Guide

## 📋 Prerequisites Check

Before starting, make sure you have:

- ✅ Node.js 18+ installed (`node --version`)
- ✅ React Native CLI installed (`npm install -g react-native-cli`)
- ✅ Android Studio installed (for Android)
- ✅ Xcode installed (for iOS - macOS only)
- ✅ Backend running on port 8080

## 🚀 Step-by-Step Setup

### Step 1: Navigate to Customer App Folder

```bash
cd customer-app
```

### Step 2: Install Dependencies

```bash
npm install
```

**Expected time:** 2-5 minutes

### Step 3: Configure API URL

Edit `src/config/api.js` and update the API URL:

**For Android Emulator:**
```javascript
const API_BASE_URL = 'http://10.0.2.2:8080/api/v1';
```

**For iOS Simulator (macOS):**
```javascript
const API_BASE_URL = 'http://localhost:8080/api/v1';
```

**For Physical Device:**
```javascript
// Find your computer's IP address
// Windows: ipconfig
// Mac/Linux: ifconfig
const API_BASE_URL = 'http://192.168.1.XXX:8080/api/v1';
```

### Step 4: Install iOS Pods (iOS Only - macOS)

If you're on macOS and want to run iOS:

```bash
cd ios
pod install
cd ..
```

### Step 5: Start Metro Bundler

**Open Terminal 1:**

```bash
cd customer-app
npm start
```

Keep this terminal running! Metro bundler should start and show:
```
Metro waiting on exp://192.168.x.x:8081
```

### Step 6: Run on Android

**Open Terminal 2 (new terminal):**

```bash
cd customer-app
npm run android
```

**Before running:**
- Make sure Android Studio is open
- Start Android Emulator (Tools → Device Manager → Start emulator)
  OR
- Connect Android phone via USB with USB debugging enabled

**First time setup:**
- Android Studio will download SDKs (may take time)
- Gradle will download dependencies (may take time)

### Step 7: Run on iOS (macOS Only)

**Open Terminal 2 (new terminal):**

```bash
cd customer-app
npm run ios
```

**Before running:**
- Make sure Xcode is installed
- Open Xcode and accept license agreements
- Start iOS Simulator (Xcode → Open Developer Tool → Simulator)

## 🎯 Quick Commands Summary

```bash
# Terminal 1 - Metro Bundler (keep running)
cd customer-app
npx react-native start

# Terminal 2 - Run App
cd customer-app
npx react-native run-android    # For Android
npx react-native run-ios        # For iOS (macOS)
```

## 🔧 Troubleshooting

### Issue: Port 8081 already in use

```bash
# Kill process on port 8081
# Windows:
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8081 | xargs kill -9

# Or use different port
npx react-native start --port 8082
```

### Issue: Android build fails

```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Issue: Dependencies not installing

```bash
rm -rf node_modules
npm cache clean --force
npm install
```

### Issue: Metro cache issues

```bash
npx react-native start --reset-cache
```

### Issue: Android emulator not starting

1. Open Android Studio
2. Tools → Device Manager
3. Create/Start emulator
4. Make sure emulator is fully loaded before running `npx react-native run-android`

## ✅ Verification Checklist

- [ ] Node.js installed
- [ ] Dependencies installed (`npm install` completed)
- [ ] API URL configured in `src/config/api.js`
- [ ] Backend is running on port 8080
- [ ] Metro bundler is running (`npx react-native start`)
- [ ] Android emulator/iOS simulator is running
- [ ] App builds successfully

## 📱 First Run

1. App will show Splash Screen
2. Then navigate to Menu Screen
3. You can browse menu as guest
4. Add items to cart
5. Login when ready to checkout

## 🎉 Success!

If you see the app running with menu items, you're all set!

---

**Need Help?** Check the error messages in terminal and refer to troubleshooting section.

