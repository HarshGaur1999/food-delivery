# Customer App - Quick Start Guide

## 🚀 Quick Commands

### First Time Setup

```bash
# 1. Go to customer-app folder
cd customer-app

# 2. Install all dependencies
npm install

# 3. For iOS only (macOS):
cd ios && pod install && cd ..

# 4. Start Metro bundler (in one terminal)
npx react-native start

# 5. Run on Android (in another terminal)
npx react-native run-android

# OR Run on iOS (macOS only)
npx react-native run-ios
```

## 📱 Running the App

### Option 1: Android

1. **Start Android Emulator** (from Android Studio)
   OR
   **Connect Android Phone** (enable USB debugging)

2. **Run:**
   ```bash
   npx react-native run-android
   ```

### Option 2: iOS (macOS only)

1. **Open Xcode**
2. **Start iOS Simulator**
3. **Run:**
   ```bash
   npx react-native run-ios
   ```

## ⚙️ Configuration

### Update API URL

Edit `src/config/api.js`:

```javascript
const API_BASE_URL = 'http://YOUR_BACKEND_IP:8080/api/v1';
// Example: 'http://192.168.1.100:8080/api/v1'
// For Android emulator: 'http://10.0.2.2:8080/api/v1'
// For iOS simulator: 'http://localhost:8080/api/v1'
```

## 🔧 Common Issues

### Port already in use
```bash
# Kill process on port 8081
npx react-native start --port 8082
```

### Clean build
```bash
# Android
cd android
./gradlew clean
cd ..

# iOS (macOS)
cd ios
rm -rf build
pod deintegrate
pod install
cd ..
```

### Reset Metro cache
```bash
npx react-native start --reset-cache
```

