# Delivery Boy App - Shiv Dhaba Food Delivery

Production-ready React Native delivery boy application for single restaurant food delivery system (Meerut only).

## 🏗️ Architecture

- **Framework**: React Native CLI (latest stable)
- **Language**: TypeScript
- **State Management**: Zustand + React Query
- **Networking**: Axios with interceptors
- **Authentication**: JWT (Access + Refresh token)
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Maps & Navigation**: Google Maps
- **Location Tracking**: Foreground + Background
- **Architecture**: Clean Architecture (presentation / domain / data)
- **Secure Storage**: Encrypted storage for tokens

## 📋 Prerequisites

- Node.js >= 18
- React Native CLI
- Android Studio (for Android development)
- JDK 11 or higher
- Android SDK (API level 23+)
- Google Maps API Key
- Firebase project (for push notifications)

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd delivery-app
npm install
```

### 2. Configure API URL

Update `src/config/api.ts` with your backend server URL:

```typescript
export const API_CONFIG = {
  BASE_URL: __DEV__
    ? 'http://YOUR_LOCAL_IP:8080/api/v1' // For Android emulator use 10.0.2.2:8080
    : 'https://your-production-api.com/api/v1',
  TIMEOUT: 30000,
};
```

### 3. Configure Google Maps

#### Android

1. Get Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable "Maps SDK for Android" and "Places API"
3. Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<application>
  <meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
</application>
```

### 4. Configure Firebase (Optional but Recommended)

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Add Android app to Firebase project
3. Download `google-services.json`
4. Place it in `android/app/`
5. Update `android/build.gradle`:

```gradle
dependencies {
    classpath("com.google.gms:google-services:4.4.0")
}
```

6. Update `android/app/build.gradle`:

```gradle
apply plugin: "com.google.gms.google-services"
```

**Note**: If Firebase is not configured, the app will still work but push notifications will be disabled.

### 5. Configure Android Permissions

Permissions are already configured in `AndroidManifest.xml`. Ensure location permissions are granted at runtime.

### 6. Run the App

```bash
# Start Metro bundler
npm start

# Run on Android (in a separate terminal)
npm run android
```

## 📱 Features

### Authentication
- ✅ Mobile number + OTP login
- ✅ OTP verification via backend API
- ✅ Login allowed ONLY if admin has created delivery boy account
- ✅ Secure JWT token storage (encrypted)
- ✅ Auto token refresh
- ✅ Auto logout on token expiry or 401

### Home Dashboard
- ✅ Currently assigned order display
- ✅ Earnings summary (Today / Total)
- ✅ Delivery history access
- ✅ Availability status toggle (Online / Offline)
- ✅ On Duty / Off Duty toggle

### Order Management
- ✅ View assigned orders
- ✅ Accept order before proceeding
- ✅ Order details with all information:
  - Order ID and number
  - Customer name and phone (tap to call)
  - Full delivery address
  - Distance from restaurant
  - Payment type (ONLINE / COD)
  - COD amount (if applicable)
  - Order items summary
  - Special instructions

### Order Status Management
- ✅ Strict sequence enforcement: READY → OUT_FOR_DELIVERY → DELIVERED
- ✅ No skipping allowed
- ✅ Prevent duplicate updates
- ✅ Backend re-validation

### Navigation & Live Tracking
- ✅ Open Google Maps for navigation
- ✅ Send live GPS coordinates to backend periodically
- ✅ Location visible to Admin and Customer
- ✅ Background tracking enabled only during active delivery
- ✅ Automatic location updates every 10 seconds

### COD Handling
- ✅ Clearly highlight COD amount
- ✅ Mandatory "Cash Collected" confirmation
- ✅ Prevent marking DELIVERED without confirmation

### Order Completion
- ✅ Stop location tracking automatically
- ✅ Mark order as DELIVERED
- ✅ Update earnings and delivery history
- ✅ Trigger notifications (Customer, Admin)

### Delivery History
- ✅ List past delivered orders
- ✅ Show date, order ID, earnings
- ✅ Tap to view order details

### Push Notifications (FCM)
- ✅ Order assigned notification
- ✅ Order cancelled notification
- ✅ Order delivered notification
- ✅ Token refresh handling

## 🔒 Security Features

- ✅ JWT stored in encrypted secure storage
- ✅ Axios interceptors for automatic auth
- ✅ Auto logout on unauthorized response
- ✅ Explicit runtime permission handling
- ✅ No background tracking when idle

## 🛠️ Project Structure

```
delivery-app/
├── src/
│   ├── app.tsx                 # Main app component
│   ├── navigation/             # Navigation setup
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── OrderNavigator.tsx
│   ├── presentation/           # UI Screens
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── OtpScreen.tsx
│   │   ├── home/
│   │   │   └── HomeScreen.tsx
│   │   ├── orders/
│   │   │   └── OrderDetailsScreen.tsx
│   │   ├── history/
│   │   │   └── DeliveryHistoryScreen.tsx
│   │   └── profile/
│   │       └── ProfileScreen.tsx
│   ├── domain/                 # Business Logic
│   │   └── models/
│   │       ├── User.ts
│   │       ├── Order.ts
│   │       ├── Auth.ts
│   │       └── Location.ts
│   ├── data/                   # Data Layer
│   │   ├── api/
│   │   │   └── apiClient.ts
│   │   └── repositories/
│   │       ├── authRepository.ts
│   │       ├── orderRepository.ts
│   │       └── deliveryRepository.ts
│   ├── store/                  # State Management
│   │   ├── authStore.ts
│   │   ├── orderStore.ts
│   │   ├── locationStore.ts
│   │   └── earningsStore.ts
│   ├── services/               # Services
│   │   ├── fcmService.ts
│   │   ├── locationService.ts
│   │   └── secureStorage.ts
│   ├── utils/                  # Utilities
│   │   ├── errors.ts
│   │   ├── format.ts
│   │   └── validation.ts
│   └── config/                 # Configuration
│       ├── api.ts
│       └── constants.ts
├── android/                    # Android native code
├── package.json
└── README.md
```

## 🔌 API Integration

### Authentication
- `POST /auth/otp/send` - Request OTP
- `POST /auth/otp/verify/delivery` - Verify OTP
- `POST /auth/refresh` - Refresh token

### Orders
- `GET /delivery/orders/available` - Get available orders
- `POST /delivery/orders/{id}/accept` - Accept order
- `PATCH /delivery/orders/{id}/status` - Update order status
- `GET /delivery/orders/my-orders` - Get my orders

### Location
- `POST /delivery/orders/{id}/update-location` - Update location

### Delivery
- `PUT /delivery/status` - Update availability
- `PUT /delivery/fcm-token` - Update FCM token

## 🐛 Edge Case Handling

- ✅ Network failure during delivery
- ✅ App killed in background
- ✅ Token expiry mid-delivery
- ✅ Duplicate status updates
- ✅ Location permission denied
- ✅ COD mismatch
- ✅ Invalid status transitions

## 📝 Development Notes

### Running on Android Emulator

For local backend, use `10.0.2.2` instead of `localhost`:

```typescript
BASE_URL: 'http://10.0.2.2:8080/api/v1'
```

### Running on Physical Device

1. Ensure device and computer are on same network
2. Find your computer's IP address
3. Update `BASE_URL` with your IP:

```typescript
BASE_URL: 'http://192.168.1.XXX:8080/api/v1'
```

### Debugging

- Use React Native Debugger or Chrome DevTools
- Check Metro bundler logs
- Check Android logcat: `adb logcat *:S ReactNative:V ReactNativeJS:V`

## 🚨 Troubleshooting

### Build Errors

1. **Gradle sync failed**
   - Clean project: `cd android && ./gradlew clean`
   - Delete `node_modules` and reinstall

2. **Metro bundler issues**
   - Clear cache: `npm start -- --reset-cache`

3. **Location permissions not working**
   - Check AndroidManifest.xml permissions
   - Ensure runtime permissions are requested

### Runtime Errors

1. **Network errors**
   - Check API URL configuration
   - Verify backend is running
   - Check network connectivity

2. **Token refresh failures**
   - Check refresh token validity
   - Verify backend refresh endpoint

3. **Location tracking not working**
   - Grant location permissions
   - Check GPS is enabled
   - Verify location services are available

## 📄 License

Private - Shiv Dhaba Food Delivery System

## 👥 Support

For issues or questions, contact the development team.

---

**Built with ❤️ for Shiv Dhaba Food Delivery**
