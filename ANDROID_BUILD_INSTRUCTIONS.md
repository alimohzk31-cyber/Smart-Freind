# How to Build the Android App

The project is set up to wrap the React application in a Flutter WebView.
However, since the Flutter tools were not detected in the current environment, the Android platform files (gradle, manifest, etc.) exist in a potential pending state.

## Prerequisites
1. **Install Flutter**: [Download Flutter SDK](https://storage.googleapis.com/flutter_infra_release/releases/stable/windows/flutter_windows_3.24.3-stable.zip)
2. **Add to PATH**: Ensure `flutter/bin` is in your System PATH.
3. **Android Setup**: Ensure you have Android Studio or the Android SDK command-line tools installed.

## One-Click Build
Run the `build_android_app.bat` file in the root directory.
It will:
1. Verify Flutter installation.
2. Repair the project (generate `android/` folder if missing).
3. Install dependencies.
4. Build the release APK.

## Manual Steps
If you prefer manual execution:
```bash
cd smart_hr_app
flutter create . --platforms=android
flutter pub get
flutter build apk --release
```

The output APK will be at: `smart_hr_app/build/app/outputs/flutter-apk/app-release.apk`
