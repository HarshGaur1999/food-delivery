# CMake Build Error Fix - react-native-reanimated

## Problem
```
Execution failed for task ':react-native-reanimated:configureCMakeDebug[arm64-v8a]'.
> [CXX1210] No compatible library found
```

## Solution Steps

### Step 1: Install CMake via Android Studio

1. **Open Android Studio**
2. Go to **Tools → SDK Manager** (or **File → Settings → Appearance & Behavior → System Settings → Android SDK**)
3. Click on the **SDK Tools** tab
4. Check the following:
   - ✅ **CMake** (check the latest version, e.g., 3.22.1 or higher)
   - ✅ **NDK (Side by side)** - Make sure version **25.1.8937393** is installed
   - ✅ **LLDB** (optional but recommended)
5. Click **Apply** and wait for installation to complete

### Step 2: Verify Installation

After installation, CMake should be located at:
```
C:\Users\Acer\AppData\Local\Android\Sdk\cmake\<version>\bin\cmake.exe
```

### Step 3: Clean and Rebuild

```powershell
# Navigate to admin-app
cd admin-app

# Clean Android build
cd android
.\gradlew.bat clean
cd ..

# Try building again
npx react-native run-android
```

### Step 4: If Still Failing - Add CMake Path (Optional)

If CMake is installed but still not found, you can manually add it to `android/local.properties`:

```properties
sdk.dir=C:\\Users\\Acer\\AppData\\Local\\Android\\Sdk
cmake.dir=C:\\Users\\Acer\\AppData\\Local\\Android\\Sdk\\cmake\\3.22.1
```

**Note:** Replace `3.22.1` with your actual CMake version.

## Alternative: Build Only for x86_64 (Quick Fix - APPLIED)

**This fix has been applied!** If CMake installation doesn't work or you're using an emulator, you can build only for x86_64 architecture. This bypasses the arm64-v8a CMake issue.

The `android/gradle.properties` has been updated to:
```properties
# Only build for x86_64 (for emulator)
reactNativeArchitectures=x86_64
```

**Note:** This means:
- ✅ Works perfectly for Android emulators (x86_64)
- ⚠️ Won't work on physical ARM devices (arm64-v8a)
- ✅ For physical devices, you'll need to install CMake (see Step 1) and change back to: `reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64`

Then rebuild:
```powershell
cd admin-app/android
.\gradlew.bat clean
cd ..
npx react-native run-android
```

## What Was Fixed

1. ✅ **NDK Version**: Changed from `26.1.10909125` to `25.1.8937393` (compatible version)
2. ✅ **Build Cache**: Cleaned Android build cache
3. ✅ **Babel Config**: Verified `react-native-reanimated/plugin` is in babel.config.js

## Next Steps

1. Install CMake via Android Studio SDK Manager (Step 1)
2. Clean and rebuild (Step 3)
3. If issues persist, try the alternative solution above

