# Fix NDK Without Android Studio

## Option 1: Delete Corrupted NDK (Easiest)

Gradle will automatically download the correct NDK when building.

```powershell
# Delete corrupted NDK folder
Remove-Item -Recurse -Force "C:\Users\Acer\AppData\Local\Android\Sdk\ndk\25.1.8937393"

# Then try building again
cd D:\food-delivery\ShivDhabaCustomer
npx react-native run-android
```

Gradle will download the required NDK automatically during build.

## Option 2: Use SDK Command Line Tools

If you have SDK command line tools installed:

```powershell
# Navigate to SDK tools
cd "C:\Users\Acer\AppData\Local\Android\Sdk\cmdline-tools\latest\bin"

# List available NDK versions
.\sdkmanager.bat --list | Select-String "ndk"

# Install latest NDK
.\sdkmanager.bat "ndk;25.1.8937393"

# Or install latest available
.\sdkmanager.bat "ndk;latest"
```

## Option 3: Download NDK Manually

1. Go to: https://developer.android.com/ndk/downloads
2. Download NDK r25b or latest version
3. Extract to: `C:\Users\Acer\AppData\Local\Android\Sdk\ndk\`
4. Rename folder to match version (e.g., `25.1.8937393`)

## Option 4: Disable NDK (If Not Needed)

If your app doesn't need native code, you can disable NDK requirement:

Already done in `build.gradle` - NDK version is commented out.

## Recommended: Option 1 (Delete and Auto-Download)

This is the easiest - just delete the corrupted folder and let Gradle handle it:

```powershell
Remove-Item -Recurse -Force "C:\Users\Acer\AppData\Local\Android\Sdk\ndk\25.1.8937393"
cd D:\food-delivery\ShivDhabaCustomer
npx react-native run-android
```

Gradle will download the correct NDK during the build process.






