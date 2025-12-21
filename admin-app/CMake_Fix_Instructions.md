# Fix CMake/NDK Build Error

## Problem
The error `[CXX1210] No compatible library found` occurs when CMake or NDK components are missing or not properly configured.

## Solution Steps

### Step 1: Install CMake via Android Studio

1. Open **Android Studio**
2. Go to **Tools → SDK Manager** (or **File → Settings → Appearance & Behavior → System Settings → Android SDK**)
3. Click on the **SDK Tools** tab
4. Check the following:
   - ✅ **CMake** (latest version, e.g., 3.22.1 or higher)
   - ✅ **NDK (Side by side)** - Make sure version **25.1.8937393** is installed
   - ✅ **LLDB** (optional but recommended)
5. Click **Apply** and wait for installation to complete

### Step 2: Verify Installation

After installation, verify that CMake is installed:
- CMake should be in: `C:\Users\Acer\AppData\Local\Android\Sdk\cmake\<version>`
- NDK should be in: `C:\Users\Acer\AppData\Local\Android\Sdk\ndk\<version>`

### Step 3: Clean and Rebuild

```powershell
cd admin-app
cd android
.\gradlew.bat clean
cd ..
npx react-native run-android
```

### Alternative: If NDK Version is Not Available

If NDK version 25.1.8937393 is not available, you can:

1. Install the latest NDK version via Android Studio SDK Manager
2. Update `admin-app/android/build.gradle` to use the installed version:
   ```gradle
   ndkVersion = "26.1.10909125"  // or your installed version
   ```

### Still Having Issues?

1. **Check Android Studio SDK Manager** - Ensure both CMake and NDK are installed
2. **Restart Android Studio** - Sometimes required after installing new components
3. **Check Environment Variables** - Ensure `ANDROID_HOME` or `ANDROID_SDK_ROOT` is set correctly
4. **Try Different NDK Version** - Some versions work better than others

## What We Fixed

✅ Removed architecture restriction (`reactNativeArchitectures`)  
✅ Removed invalid `cmakeVersion` property  
✅ Added ABI filters to support all architectures  
✅ Cleaned build cache

The build should now work once CMake and NDK are properly installed via Android Studio.





