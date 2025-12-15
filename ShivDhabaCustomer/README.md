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
npm install --legacy-peer-deps
```

### Running the App

```bash
# Terminal 1 - Start Metro Bundler
npx react-native start

# Terminal 2 - Run on Android (Phone connected)
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

API URL is configured in `src/config/api.js`:
- Current: `http://10.164.155.177:8080/api/v1` (Physical device)

## 📝 Notes

- Make sure backend is running on `http://10.164.155.177:8080`
- Phone should be connected via USB with USB debugging enabled
- Use `adb devices` to verify phone connection
