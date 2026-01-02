# Rebuild Android App to Apply Network Security Config
# This script cleans and rebuilds the Android app

Write-Host "🧹 Cleaning Android build..." -ForegroundColor Yellow
cd android
./gradlew clean
cd ..

Write-Host "🗑️  Cleaning Metro bundler cache..." -ForegroundColor Yellow
npx react-native start --reset-cache &
$metroPid = $pid

Write-Host "⏳ Waiting 5 seconds for Metro to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "🔨 Rebuilding Android app..." -ForegroundColor Green
Write-Host "Make sure your Android emulator is running or device is connected!" -ForegroundColor Cyan
npx react-native run-android

Write-Host "✅ Build complete! Check if network connectivity works now." -ForegroundColor Green


