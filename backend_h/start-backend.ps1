# Backend Server Startup Script
# Run this script to start the Spring Boot backend server

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Shiv Dhaba Backend Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Java is installed
Write-Host "Checking Java installation..." -ForegroundColor Yellow
$javaVersion = java -version 2>&1 | Select-Object -First 1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Java is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Java 17 or higher" -ForegroundColor Red
    exit 1
}
Write-Host "Java found: $javaVersion" -ForegroundColor Green
Write-Host ""

# Check if Maven is installed
Write-Host "Checking Maven installation..." -ForegroundColor Yellow
$mavenVersion = mvn -version 2>&1 | Select-Object -First 1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Maven is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Maven" -ForegroundColor Red
    exit 1
}
Write-Host "Maven found: $mavenVersion" -ForegroundColor Green
Write-Host ""

# Check if port 8080 is already in use
Write-Host "Checking if port 8080 is available..." -ForegroundColor Yellow
$portCheck = netstat -an | findstr ":8080"
if ($portCheck) {
    Write-Host "WARNING: Port 8080 is already in use!" -ForegroundColor Red
    Write-Host "Port status:" -ForegroundColor Yellow
    Write-Host $portCheck
    Write-Host ""
    $response = Read-Host "Do you want to continue anyway? (y/n)"
    if ($response -ne "y") {
        Write-Host "Exiting..." -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "Port 8080 is available" -ForegroundColor Green
}
Write-Host ""

# Navigate to backend directory
Set-Location $PSScriptRoot

# Start the Spring Boot application
Write-Host "Starting Spring Boot application..." -ForegroundColor Cyan
Write-Host "Backend will be available at: http://192.168.29.104:8080" -ForegroundColor Green
Write-Host "API endpoint: http://192.168.29.104:8080/api/v1/public/menu" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Run Maven Spring Boot
mvn spring-boot:run
