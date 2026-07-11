# iOS / Android app shell (Capacitor)

The repo contains a complete [Capacitor](https://capacitorjs.com) 8 project that
wraps the same `index.html` in real iOS and Android apps. **The web/PWA version
is unaffected** — native features are feature-detected and dormant in the browser.

## What's already done

- `capacitor.config.json` — app id `com.drcraigcanapari.sleepdiary`, name "Sleep Diary"
- `ios/` and `android/` native projects, generated and synced
  (iOS uses Swift Package Manager — **no CocoaPods needed**)
- App icons and splash screens (light + dark) for both platforms, generated
  from `assets/` by `@capacitor/assets`
- Native features wired into the app, active only inside the shell:
  - **Daily reminder** — a local notification ("Add last night…") scheduled on
    the phone at a parent-chosen time. No server involved. Appears as a new
    control in the Diary → Setup card.
  - **Share sheet** — CSV and backup exports go through the OS share sheet
    (AirDrop / Messages / Mail / Files) instead of a browser download.
  - Service worker skipped (the shell is inherently offline); Google Drive
    backup shows a friendly "use Share backup file instead" message (OAuth
    popups don't work in embedded webviews).
- Build pipeline: `npm run build` copies the web app into `www/` and
  regenerates `demo.html`; `npm run sync` also updates the native projects.

## What's left (requires your accounts / bigger installs)

### To run on a simulator or your own phone — no accounts needed

**iOS** (~30 min, mostly Xcode download):
1. Install **Xcode** from the Mac App Store (large download).
2. `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`
3. `npm run ios` → Xcode opens → pick a simulator → ▶ Run.
   (To run on your physical iPhone, Xcode → Signing & Capabilities → set Team
   to your free Apple ID; free "personal team" signing works for 7 days at a time.)

**Android** (~30 min):
1. Install **Android Studio** (bundles the SDK).
2. `npm run android` → Android Studio opens → pick an emulator or a plugged-in
   phone → ▶ Run.

### To ship to the stores

1. **Apple Developer Program** ($99/yr) — enroll at developer.apple.com;
   identity verification takes 1–2 days. Then in Xcode set the Team, archive
   (Product → Archive), and upload via the Organizer. Create the listing in
   App Store Connect (screenshots, description, privacy label: **no data
   collected**). Review typically 1–3 days.
2. **Google Play Console** ($25 once) — play.google.com/console. Note: new
   individual accounts must run a closed test (a dozen-plus testers, 2 weeks)
   before public release. Build with Android Studio (Build → Generate Signed
   App Bundle) and upload.

## Known gaps / future work in the shell

- **Print / save PDF** is hidden inside the native app (WKWebView has no
  `window.print()`). Copy-summary and CSV/backup sharing cover the workflow;
  a print plugin (e.g. `capacitor-print` or a PDF-generation library) is the
  future fix if the PDF report matters in-app.
- **Google Drive backup** would need a native Google Sign-In plugin; the
  share-sheet backup file is the supported path in the shell.
- Reminder is a single fixed daily notification (id 1). Per-child or smarter
  reminders would extend `applyReminder()` in `index.html`.

## Day-to-day workflow after editing index.html

```bash
npm run sync     # rebuild www/ + demo.html, update both native projects
npm run ios      # open in Xcode
npm run android  # open in Android Studio
```

Remember the web deploy rule still applies too: bump `CACHE_VERSION` in
`sw.js` before pushing web changes.
