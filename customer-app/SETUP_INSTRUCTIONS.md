# Customer App Setup - Step by Step

## Prerequisites

1. **Node.js 18+** installed
2. **React Native CLI** installed globally
3. **Android Studio** (for Android development)
4. **Xcode** (for iOS development - macOS only)

## Step 1: Install React Native CLI (if not installed)

```bash
npm install -g react-native-cli
```

## Step 2: Navigate to Customer App Directory

```bash
cd customer-app
```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Install iOS Pods (Only for iOS - macOS only)

If you're on macOS and want to run iOS:

```bash
cd ios
pod install
cd ..
```

## Step 5: Start Metro Bundler

Open a new terminal and run:

```bash
cd customer-app
npm start
```

Keep this terminal running.

## Step 6: Run on Android

Open another terminal:

```bash
cd customer-app
npm run android
```

**Make sure:**
- Android Studio is installed
- Android emulator is running OR
- Physical Android device is connected with USB debugging enabled

## Step 7: Run on iOS (macOS only)

Open another terminal:

```bash
cd customer-app
npm run ios
```

**Make sure:**
- Xcode is installed
- iOS Simulator is available

## Troubleshooting

### If Android build fails:
1. Make sure Android SDK is installed
2. Set ANDROID_HOME environment variable
3. Run: `cd android && ./gradlew clean`

### If dependencies fail:
```bash
rm -rf node_modules
npm install
```

### Clear cache:
```bash
npm start -- --reset-cache
```

## Project Structure

```
customer-app/
├── src/
│   ├── config/
│   │   └── api.js          # API configuration
│   ├── services/           # API services
│   ├── store/              # Redux store
│   ├── screens/            # App screens
│   └── navigation/         # Navigation setup
├── android/                # Android native code
├── ios/                    # iOS native code
└── package.json

```







