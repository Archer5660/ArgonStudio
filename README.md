# ArgonStudio

ArgonStudio packages the interactive Argon showcase experience as a desktop app. The macOS app is built natively with SwiftUI and WKWebView; Windows and Linux use Electron to show the same bundled HTML, CSS, and JavaScript locally.

## Build on macOS

```sh
./script/build_and_run.sh
./script/build_and_run.sh package
```

The package command creates `dist/ArgonStudio.app`. GitHub Releases include that app as a ZIP and a `.dmg`. The `.app` is inside the ZIP because GitHub release assets are files.

## Build on Windows and Linux

Install Node.js 22 or newer, then run `npm install` and either `npm run dist:windows` or `npm run dist:linux` on the matching operating system. Windows produces an NSIS `.exe`; Linux produces a Debian `.deb`.

Pushing a version tag such as `v1.0.0` triggers builds on macOS, Windows, and Linux, then publishes the artifacts as a GitHub Release.

## Credits

The included interactive experience is based on the files supplied for the Google Gemini Argon showcase. Google and Gemini are trademarks of Google LLC.
