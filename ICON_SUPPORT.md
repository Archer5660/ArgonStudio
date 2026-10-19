# App icon

`AppIcon.icon` uses the 1024 px Light image as its default artwork and the 1024 px Dark image as its dark appearance override. The sources came from `/Users/archershilling/Documents/Argon Icon`.

macOS builds the layered Icon Composer document with Apple's `actool` into `Assets.car` and `AppIcon.icns`, then adds the icon metadata to the app bundle. The document has the macOS platform enabled and uses the system's Liquid Glass icon rendering for Clear appearances. The system creates Clear Light and Clear Dark from the layered artwork as the person changes icon style in macOS settings.
