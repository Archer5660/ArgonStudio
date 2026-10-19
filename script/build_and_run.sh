#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-run}"
APP_NAME="ArgonStudio"
BUNDLE_ID="com.archershilling.ArgonStudio"
MIN_SYSTEM_VERSION="13.0"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_VERSION="$(node -p "require('$ROOT_DIR/package.json').version")"
DIST_DIR="$ROOT_DIR/dist"
APP_BUNDLE="$DIST_DIR/$APP_NAME.app"
APP_CONTENTS="$APP_BUNDLE/Contents"
APP_MACOS="$APP_CONTENTS/MacOS"
APP_RESOURCES="$APP_CONTENTS/Resources"
APP_BINARY="$APP_MACOS/$APP_NAME"
INFO_PLIST="$APP_CONTENTS/Info.plist"
APP_ICON_SOURCE="$ROOT_DIR/AppIcon.icon"

cd "$ROOT_DIR"
if [[ "$MODE" != "package" ]]; then
  pkill -x "$APP_NAME" >/dev/null 2>&1 || true
fi
BUILD_CONFIGURATION=debug
if [[ "$MODE" == "package" ]]; then BUILD_CONFIGURATION=release; fi
swift build -c "$BUILD_CONFIGURATION"
BUILD_BIN_PATH="$(swift build -c "$BUILD_CONFIGURATION" --show-bin-path)"
BUILD_BINARY="$BUILD_BIN_PATH/$APP_NAME"
BUILD_RESOURCES="$BUILD_BIN_PATH/ArgonStudio_ArgonStudio.bundle"
rm -rf "$APP_BUNDLE"
mkdir -p "$APP_MACOS" "$APP_RESOURCES"
cp "$BUILD_BINARY" "$APP_BINARY"
cp -R "$BUILD_RESOURCES" "$APP_RESOURCES/"
chmod +x "$APP_BINARY"
cat > "$APP_CONTENTS/Info.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>CFBundleExecutable</key><string>$APP_NAME</string>
<key>CFBundleIdentifier</key><string>$BUNDLE_ID</string>
<key>CFBundleName</key><string>$APP_NAME</string>
<key>CFBundleShortVersionString</key><string>$APP_VERSION</string>
<key>CFBundleVersion</key><string>$APP_VERSION</string>
<key>CFBundlePackageType</key><string>APPL</string>
<key>LSMinimumSystemVersion</key><string>$MIN_SYSTEM_VERSION</string>
<key>NSPrincipalClass</key><string>NSApplication</string>
</dict></plist>
PLIST
if [[ -d "$APP_ICON_SOURCE" ]]; then
  xcrun actool "$APP_ICON_SOURCE" \
    --compile "$APP_RESOURCES" \
    --platform macosx \
    --target-device mac \
    --minimum-deployment-target "$MIN_SYSTEM_VERSION" \
    --app-icon AppIcon \
    --output-partial-info-plist "$APP_CONTENTS/AppIcon-Partial.plist"
  /usr/libexec/PlistBuddy -c "Merge $APP_CONTENTS/AppIcon-Partial.plist" "$INFO_PLIST"
  /usr/libexec/PlistBuddy -c 'Add :CFBundleIconName string AppIcon' "$INFO_PLIST" 2>/dev/null || true
  rm -f "$APP_CONTENTS/AppIcon-Partial.plist"
fi
open_app() { /usr/bin/open -n "$APP_BUNDLE"; }
case "$MODE" in
  run) open_app ;;
  package) echo "Packaged $APP_BUNDLE" ;;
  --debug|debug) lldb -- "$APP_BINARY" ;;
  --logs|logs) open_app; /usr/bin/log stream --info --style compact --predicate "process == \"$APP_NAME\"" ;;
  --telemetry|telemetry) open_app; /usr/bin/log stream --info --style compact --predicate "subsystem == \"$BUNDLE_ID\"" ;;
  --verify|verify) open_app; sleep 1; pgrep -x "$APP_NAME" >/dev/null ;;
  *) echo "usage: $0 [run|package|--debug|--logs|--telemetry|--verify]" >&2; exit 2 ;;
esac
