# Shiv Dhaba - Customer App

React Native Customer App for food delivery system.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS - macOS only)

### Installation

```bash
# Install dependencies
npm install

# For iOS (macOS only)
cd ios && pod install && cd ..
```

### Running the App

```bash
# Terminal 1 - Start Metro Bundler
npx react-native start

# Terminal 2 - Run on Android
npx react-native run-android

# OR Terminal 2 - Run on iOS (macOS only)
npx react-native run-ios
```

## 📱 Features

- OTP-based Authentication
- Menu Browsing
- Shopping Cart
- Order Placement
- Order Tracking
- Payment Integration (COD + Razorpay)
- Real-time Notifications

## ⚙️ Configuration

Update API URL in `src/config/api.js`:
- Android Emulator: `http://10.0.2.2:8080/api/v1`
- iOS Simulator: `http://localhost:8080/api/v1`
- Physical Device: `http://YOUR_IP:8080/api/v1`

## 📚 Documentation

- `RUN_INSTRUCTIONS.md` - Detailed setup guide (Hindi/English)
- `STEP_BY_STEP_SETUP.md` - Complete setup instructions
- `QUICK_START.md` - Quick reference commands

## 🔧 Troubleshooting

If you face dependency issues, use:
```bash
npm install --legacy-peer-deps
```

## 📝 Notes

- This app uses `--legacy-peer-deps` flag for dependency resolution
- Make sure backend is running on port 8080
- For Android, ensure emulator is running before `npx react-native run-android`
