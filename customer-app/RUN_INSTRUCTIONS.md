# 🚀 Customer App - Run Instructions (Hindi/English)

## ⚡ Quick Start (3 Steps)

### Step 1: Dependencies Install Karo

```bash
cd customer-app
npm install
```

**Time:** 2-5 minutes

### Step 2: Metro Bundler Start Karo (Terminal 1)

```bash
npx react-native start
```

**Ye terminal open rakho!** Metro bundler running rehna chahiye.

### Step 3: App Run Karo (Terminal 2 - Naya Terminal)

**Android ke liye:**
```bash
npx react-native run-android
```

**iOS ke liye (macOS only):**
```bash
npx react-native run-ios
```

---

## 📋 Complete Setup (First Time)

### Prerequisites Check

1. **Node.js 18+** installed?
   ```bash
   node --version
   ```

2. **React Native CLI** installed?
   ```bash
   npm install -g react-native-cli
   ```

3. **Android Studio** installed? (Android ke liye)
   - Android Studio download karo
   - Android SDK install karo
   - Emulator setup karo

4. **Backend running?**
   - Backend `http://localhost:8080` par chal raha hona chahiye

### Step-by-Step

#### Step 1: Customer App Folder me jao

```bash
cd customer-app
```

#### Step 2: Dependencies Install Karo

```bash
npm install
```

Agar error aaye:
```bash
rm -rf node_modules
npm cache clean --force
npm install
```

#### Step 3: API URL Configure Karo

File: `src/config/api.js`

**Android Emulator ke liye:**
```javascript
const API_BASE_URL = 'http://10.0.2.2:8080/api/v1';
```

**iOS Simulator ke liye (macOS):**
```javascript
const API_BASE_URL = 'http://localhost:8080/api/v1';
```

**Physical Device ke liye:**
1. Apne computer ka IP address nikalo:
   - Windows: `ipconfig` (Command Prompt me)
   - Mac/Linux: `ifconfig` (Terminal me)
2. API URL me use karo:
   ```javascript
   const API_BASE_URL = 'http://192.168.1.XXX:8080/api/v1';
   ```

#### Step 4: iOS Pods Install Karo (iOS Only - macOS)

```bash
cd ios
pod install
cd ..
```

#### Step 5: Metro Bundler Start Karo

**Terminal 1 me:**
```bash
npx react-native start
```

Ye terminal **open rakho**. Metro bundler running rehna chahiye.

#### Step 6: Android Emulator Start Karo

1. Android Studio kholo
2. Tools → Device Manager
3. Emulator select karo (ya naya create karo)
4. Start button dabao
5. Emulator fully load hone tak wait karo

#### Step 7: App Run Karo

**Terminal 2 me (naya terminal):**
```bash
cd customer-app
npx react-native run-android
```

**Ya iOS ke liye:**
```bash
npx react-native run-ios
```

---

## ✅ Success Check

Agar sab sahi hai to:
- ✅ Metro bundler running hoga
- ✅ App emulator/simulator me open hogi
- ✅ Splash screen dikhega
- ✅ Menu screen dikhega

---

## 🔧 Common Issues & Solutions

### Issue 1: Port 8081 already in use

**Solution:**
```bash
# Windows:
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8081 | xargs kill -9

# Ya different port use karo:
npx react-native start --port 8082
```

### Issue 2: Android build fails

**Solution:**
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Issue 3: Dependencies install nahi ho rahe

**Solution:**
```bash
rm -rf node_modules
npm cache clean --force
npm install
```

### Issue 4: Metro cache issue

**Solution:**
```bash
npx react-native start --reset-cache
```

### Issue 5: Android emulator nahi start ho raha

**Solution:**
1. Android Studio kholo
2. Tools → Device Manager
3. Emulator create/start karo
4. Emulator fully load hone tak wait karo
5. Phir `npx react-native run-android` run karo

### Issue 6: API connection error

**Solution:**
1. Backend running hai check karo
2. API URL sahi hai check karo (`src/config/api.js`)
3. Firewall check karo
4. Physical device use kar rahe ho to computer ka IP address sahi hai check karo

---

## 📱 App Features

1. **Splash Screen** - App start hote hi
2. **Menu Screen** - Menu items browse karo
3. **Cart** - Items add/remove karo
4. **Checkout** - Order place karo
5. **Order Tracking** - Order status dekho
6. **Profile** - User profile dekho
7. **Login** - OTP se login karo

---

## 🎯 Next Steps

1. ✅ App successfully run ho gaya
2. ✅ Menu items dikh rahe hain
3. ✅ Cart me items add ho rahe hain
4. ✅ Order place ho raha hai

**Agar koi issue hai to error message share karo!**

