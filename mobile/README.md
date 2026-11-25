# Winear.me phone apps (Android + iPhone)

The apps are a native shell (Capacitor 8) that opens **https://winear.me**, so every
change pushed to the website shows up in the apps at once – no app update needed.
Without internet the app shows a small "You're offline" screen (`www/offline.html`).

- App ID: `me.winear.app` · Name: Winear.me
- Icon and splash: `assets/icon.svg`, `assets/splash.svg` → `npm run assets` regenerates all sizes
- Google sign-in is hidden inside the apps for now (Google blocks sign-in inside embedded
  browsers). Next step: native sign-in with `@capacitor-firebase/authentication`.

## Builds (GitHub Actions → "Build phone apps")
Runs on every push that touches `mobile/`, or manually: Actions → Build phone apps → Run workflow.
Downloads appear at the bottom of the run page:
- **Winear.me-Android-APK** – install directly on an Android phone (allow "install unknown apps").
- **Winear.me-Android-GooglePlay-AAB** – only once the signing secrets below exist.
- **Winear.me-iOS-Simulator** – proves the iPhone app builds; runs in Xcode's simulator.

## Publishing
**Google Play** ($25 one-time Play Console account)
1. Create an upload key once: `keytool -genkey -v -keystore upload.jks -alias winear -keyalg RSA -keysize 2048 -validity 10000`
2. GitHub repo → Settings → Secrets → Actions: `ANDROID_KEYSTORE_BASE64` (`base64 -w0 upload.jks`),
   `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS` (`winear`), `ANDROID_KEY_PASSWORD`. Keep upload.jks safe.
3. Re-run the workflow, download the .aab, upload it in Play Console (internal testing first).

**App Store** (Apple Developer Program, $99/year)
- Needs signing certificates; either open `ios/App/App.xcodeproj` in Xcode on a Mac
  (Product → Archive → Distribute), or add App Store Connect API secrets to the workflow.
- Apple can reject apps that are "just a website"; the native sign-in, saved plans and
  notifications planned next make approval more likely.

## Local work
```
cd mobile && npm install && npx cap sync
npx cap open android   # Android Studio
npx cap open ios       # Xcode (Mac only)
```
