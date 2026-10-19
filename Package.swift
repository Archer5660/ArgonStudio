// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "ArgonStudio",
    platforms: [.macOS(.v13)],
    products: [
        .executable(name: "ArgonStudio", targets: ["ArgonStudio"])
    ],
    targets: [
        .executableTarget(
            name: "ArgonStudio",
            resources: [.copy("Web")]
        )
    ]
)
