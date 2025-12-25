@echo off
echo ===================================================
echo   Smart HR App - Android Build Script
echo ===================================================

REM Check if Flutter is installed
where flutter >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Flutter is not installed or not in your PATH.
    echo Please install Flutter from: https://flutter.dev/docs/get-started/install/windows
    echo After installing, run this script again.
    pause
    exit /b 1
)

echo [INFO] Flutter found. Checking project structure...

cd smart_hr_app

REM Check if android directory exists
if not exist "android" (
    echo [WARN] Android platform files missing. Running 'flutter create .' to generate them...
    call flutter create . --platforms=android
)

echo [INFO] Installing dependencies...
call flutter pub get

echo [INFO] Building Release APK...
call flutter build apk --release

if %errorlevel% equ 0 (
    echo [SUCCESS] APK built successfully!
    echo Location: smart_hr_app\build\app\outputs\flutter-apk\app-release.apk
) else (
    echo [ERROR] Build failed. Please check the error messages above.
)

pause
