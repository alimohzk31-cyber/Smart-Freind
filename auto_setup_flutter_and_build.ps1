$ErrorActionPreference = "Stop"

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "   Smart HR App - Auto Setup & Build Script" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

$flutterVersion = "3.24.3-stable"
$flutterUrl = "https://storage.googleapis.com/flutter_infra_release/releases/stable/windows/flutter_windows_$flutterVersion.zip"
$toolsDir = Join-Path $PSScriptRoot "tools"
$flutterDir = Join-Path $toolsDir "flutter"
$zipPath = Join-Path $toolsDir "flutter.zip"
$projectDir = Join-Path $PSScriptRoot "smart_hr_app"

# 1. Create tools directory
if (-not (Test-Path $toolsDir)) {
    New-Item -ItemType Directory -Path $toolsDir | Out-Null
    Write-Host "[INFO] Created tools directory." -ForegroundColor Green
}

# 2. Check/Download Flutter
if (-not (Test-Path "$flutterDir\bin\flutter.bat")) {
    Write-Host "[INFO] Flutter not found locally. Downloading..." -ForegroundColor Yellow
    Write-Host "       URL: $flutterUrl"
    
    Invoke-WebRequest -Uri $flutterUrl -OutFile $zipPath
    
    Write-Host "[INFO] Download complete. Extracting..." -ForegroundColor Yellow
    Expand-Archive -Path $zipPath -DestinationPath $toolsDir -Force
    
    Remove-Item $zipPath -Force
    Write-Host "[INFO] Flutter installed to $flutterDir" -ForegroundColor Green
} else {
    Write-Host "[INFO] Flutter found locally." -ForegroundColor Green
}

# 3. Add to PATH (Process scope only)
$env:Path = "$flutterDir\bin;" + $env:Path
Write-Host "[INFO] Added Flutter to PATH for this session." -ForegroundColor Green

# 4. Configure Flutter (Suppress analytics)
flutter config --no-analytics

# 5. Repair/Prepare Project
Write-Host "[INFO] Preparing project in $projectDir..." -ForegroundColor Yellow
Set-Location $projectDir

if (-not (Test-Path "android")) {
    Write-Host "[WARN] Android platform missing. repairing..." -ForegroundColor Magenta
    flutter create . --platforms=android
}

# 6. Build
Write-Host "[INFO] Fetching dependencies..." -ForegroundColor Yellow
flutter pub get

Write-Host "[INFO] Building Release APK..." -ForegroundColor Yellow
flutter build apk --release

# 7. Verify
$apkPath = "$projectDir\build\app\outputs\flutter-apk\app-release.apk"
if (Test-Path $apkPath) {
    Write-Host "===================================================" -ForegroundColor Cyan
    Write-Host "[SUCCESS] APK Built Successfully!" -ForegroundColor Green
    Write-Host "Location: $apkPath" -ForegroundColor White
    Write-Host "===================================================" -ForegroundColor Cyan
} else {
    Write-Host "[ERROR] APK build failed." -ForegroundColor Red
    exit 1
}
