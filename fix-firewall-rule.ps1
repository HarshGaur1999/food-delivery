# Fix Windows Firewall Rule for Spring Boot Backend (Port 8080)
# Run this script as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Spring Boot Firewall Fix Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

Write-Host "[1/4] Checking if firewall rule already exists..." -ForegroundColor Yellow
$existingRule = Get-NetFirewallRule -DisplayName "Spring Boot API Port 8080" -ErrorAction SilentlyContinue

if ($existingRule) {
    Write-Host "     Firewall rule already exists. Checking status..." -ForegroundColor Yellow
    $ruleEnabled = ($existingRule | Get-NetFirewallPortFilter).LocalPort -eq "8080"
    if ($ruleEnabled) {
        Write-Host "     ✅ Firewall rule is already configured!" -ForegroundColor Green
    } else {
        Write-Host "     Rule exists but may need updating. Recreating..." -ForegroundColor Yellow
        Remove-NetFirewallRule -DisplayName "Spring Boot API Port 8080" -ErrorAction SilentlyContinue
    }
} else {
    Write-Host "     No existing rule found. Creating new rule..." -ForegroundColor Yellow
}

# Create or update firewall rule
Write-Host "[2/4] Creating firewall rule for port 8080..." -ForegroundColor Yellow
try {
    New-NetFirewallRule -DisplayName "Spring Boot API Port 8080" `
        -Direction Inbound `
        -LocalPort 8080 `
        -Protocol TCP `
        -Action Allow `
        -Profile Domain,Private,Public `
        -ErrorAction Stop | Out-Null
    Write-Host "     ✅ Firewall rule created successfully!" -ForegroundColor Green
} catch {
    Write-Host "     ❌ Failed to create firewall rule: $_" -ForegroundColor Red
    exit 1
}

# Verify rule was created
Write-Host "[3/4] Verifying firewall rule..." -ForegroundColor Yellow
$rule = Get-NetFirewallRule -DisplayName "Spring Boot API Port 8080" -ErrorAction SilentlyContinue
if ($rule) {
    $ruleStatus = $rule.Enabled
    $ruleAction = $rule.Action
    Write-Host "     Rule Status: $ruleStatus" -ForegroundColor $(if ($ruleStatus -eq "True") { "Green" } else { "Red" })
    Write-Host "     Rule Action: $ruleAction" -ForegroundColor Green
    Write-Host "     ✅ Firewall rule verified!" -ForegroundColor Green
} else {
    Write-Host "     ❌ Failed to verify firewall rule!" -ForegroundColor Red
    exit 1
}

# Check if backend is running
Write-Host "[4/4] Checking backend status..." -ForegroundColor Yellow
$port8080 = netstat -ano | findstr :8080 | findstr LISTENING
if ($port8080) {
    Write-Host "     ✅ Backend is running on port 8080" -ForegroundColor Green
} else {
    Write-Host "     ⚠️  Backend is not running on port 8080" -ForegroundColor Yellow
    Write-Host "     Please start the backend: cd backend && mvn spring-boot:run" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Firewall Fix Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Ensure backend is running: cd backend && mvn spring-boot:run" -ForegroundColor White
Write-Host "2. Test connection: Invoke-WebRequest -Uri 'http://localhost:8080/api/v1/public/menu' -Method GET" -ForegroundColor White
Write-Host "3. Restart your React Native app in the Android emulator" -ForegroundColor White
Write-Host ""

