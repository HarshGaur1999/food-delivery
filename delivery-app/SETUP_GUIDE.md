# Delivery App Setup Guide

## Quick Start Checklist

- [ ] Install Node.js (>= 18)
- [ ] Install React Native CLI
- [ ] Install Android Studio
- [ ] Configure Android SDK
- [ ] Get Google Maps API Key
- [ ] (Optional) Set up Firebase for push notifications
- [ ] Update API URL in `src/config/api.ts`
- [ ] Run `npm install`
- [ ] Run `npm run android`

## Detailed Setup

### 1. Environment Setup

#### Install Node.js
Download and install Node.js 18 or higher from [nodejs.org](https://nodejs.org/)

#### Install React Native CLI
```bash
npm install -g react-native-cli
```

#### Install Android Studio
1. Download from [developer.android.com/studio](https://developer.android.com/studio)
2. Install Android SDK (API level 23+)
3. Configure ANDROID_HOME environment variable
4. Add platform-tools to PATH

### 2. Project Setup

#### Install Dependencies
```bash
cd delivery-app
npm install
```

#### Configure API URL
Edit `src/config/api.ts`:
- For Android Emulator: `http://10.0.2.2:8080/api/v1`
- For Physical Device: `http://YOUR_COMPUTER_IP:8080/api/v1`
- For Production: `https://your-api-domain.com/api/v1`

### 3. Google Maps Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Maps SDK for Android"
4. Create API key
5. Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_API_KEY_HERE"/>
```

### 4. Firebase Setup (Optional)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project
3. Add Android app
4. Download `google-services.json`
5. Place in `android/app/`
6. Update `android/build.gradle` and `android/app/build.gradle` as per README

### 5. Build and Run

```bash
# Start Metro bundler
npm start

# In another terminal, run Android
npm run android
```

## Common Issues

### Metro Bundler Issues
```bash
npm start -- --reset-cache
```

### Gradle Build Issues
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Location Permissions
- Ensure permissions are granted at runtime
- Check AndroidManifest.xml has all required permissions

### Network Issues
- Verify backend is running
- Check API URL is correct
- For emulator, use `10.0.2.2` instead of `localhost`

## Next Steps

1. Test login flow
2. Verify order assignment
3. Test location tracking
4. Test order status updates
5. Verify COD handling
6. Test push notifications (if Firebase configured)











