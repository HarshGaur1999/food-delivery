# Network Issue Fix Script for Food Delivery App
# Run this script as Administrator

Write-Host "=== Network Connection Fix for Food Delivery App ===" -ForegroundColor Cyan
Write-Host ""

# Check if running as admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Alternatively, run this command manually:" -ForegroundColor Yellow
    Write-Host 'netsh advfirewall firewall add rule name="Spring Boot 8080 Inbound" dir=in action=allow protocol=TCP localport=8080' -ForegroundColor White
    exit 1
}

# Get current IP address
Write-Host "1. Checking current IP address..." -ForegroundColor Yellow
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias (Get-NetConnectionProfile | Where-Object { $_.IPv4Connectivity -eq 'Internet' }).InterfaceAlias -ErrorAction SilentlyContinue | Where-Object { $_.IPAddress -like '192.168.*' -or $_.IPAddress -like '10.*' }).IPAddress | Select-Object -First 1

if ($ipAddress) {
    Write-Host "   Current IP: $ipAddress" -ForegroundColor Green
} else {
    Write-Host "   Warning: Could not auto-detect IP address" -ForegroundColor Yellow
    Write-Host "   Please verify IP address manually with: ipconfig" -ForegroundColor Yellow
}

# Check if backend is running
Write-Host ""
Write-Host "2. Checking if backend is running on port 8080..." -ForegroundColor Yellow
$backendRunning = netstat -an | Select-String ":8080.*LISTENING"
if ($backendRunning) {
    Write-Host "   ✅ Backend is running on port 8080" -ForegroundColor Green
} else {
    Write-Host "   ❌ Backend is NOT running on port 8080" -ForegroundColor Red
    Write-Host "   Please start your Spring Boot backend application" -ForegroundColor Yellow
}

# Add firewall rule
Write-Host ""
Write-Host "3. Adding Windows Firewall rule for port 8080..." -ForegroundColor Yellow
try {
    $ruleExists = netsh advfirewall firewall show rule name="Spring Boot 8080 Inbound" 2>$null
    if ($ruleExists) {
        Write-Host "   ⚠️  Firewall rule already exists" -ForegroundColor Yellow
        Write-Host "   Removing existing rule to recreate..." -ForegroundColor Yellow
        netsh advfirewall firewall delete rule name="Spring Boot 8080 Inbound" | Out-Null
    }
    
    netsh advfirewall firewall add rule name="Spring Boot 8080 Inbound" dir=in action=allow protocol=TCP localport=8080 | Out-Null
    Write-Host "   ✅ Firewall rule added successfully" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to add firewall rule: $_" -ForegroundColor Red
}

# Test endpoint
Write-Host ""
Write-Host "4. Testing backend endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/public/menu" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    Write-Host "   ✅ Backend endpoint is accessible locally (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Could not reach backend locally: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "   Make sure your backend is running" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "IP Address: $ipAddress" -ForegroundColor White
Write-Host "Backend URL: http://${ipAddress}:8080/api/v1" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Verify your React Native app is using IP: $ipAddress" -ForegroundColor White
Write-Host "2. Ensure your device and computer are on the same WiFi network" -ForegroundColor White
Write-Host "3. If you modified network_security_config.xml, rebuild the app:" -ForegroundColor White
Write-Host "   cd ShivDhabaCustomer/android" -ForegroundColor Gray
Write-Host "   ./gradlew clean" -ForegroundColor Gray
Write-Host "   cd .." -ForegroundColor Gray
Write-Host "   npx react-native run-android" -ForegroundColor Gray
Write-Host "4. Test the endpoint from your device's browser:" -ForegroundColor White
Write-Host "   http://${ipAddress}:8080/api/v1/public/menu" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")





















