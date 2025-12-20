@echo off
REM Backend Server Startup Script for Windows
REM Double-click this file to start the backend server

echo ========================================
echo Starting Shiv Dhaba Backend Server
echo ========================================
echo.

REM Check if Java is installed
echo Checking Java installation...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 17 or higher
    pause
    exit /b 1
)
echo Java found!
echo.

REM Check if Maven is installed
echo Checking Maven installation...
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Maven is not installed or not in PATH
    echo Please install Maven
    pause
    exit /b 1
)
echo Maven found!
echo.

REM Check if port 8080 is already in use
echo Checking if port 8080 is available...
netstat -an | findstr ":8080" >nul
if %errorlevel% equ 0 (
    echo WARNING: Port 8080 is already in use!
    echo.
    pause
)

REM Navigate to backend directory
cd /d "%~dp0"

REM Start the Spring Boot application
echo Starting Spring Boot application...
echo Backend will be available at: http://192.168.29.104:8080
echo API endpoint: http://192.168.29.104:8080/api/v1/public/menu
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

REM Run Maven Spring Boot
mvn spring-boot:run

pause
