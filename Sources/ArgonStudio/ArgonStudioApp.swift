import SwiftUI

@main
struct ArgonStudioApp: App {
    var body: some Scene {
        WindowGroup("Argon Studio") {
            ArgonSceneView()
                .frame(minWidth: 760, minHeight: 500)
                .ignoresSafeArea()
                .modifier(HideWindowTitle())
        }
        .windowResizability(.contentSize)
    }
}

private struct HideWindowTitle: ViewModifier {
    @ViewBuilder
    func body(content: Content) -> some View {
        if #available(macOS 15.0, *) {
            content.toolbar(removing: .title)
        } else {
            content
        }
    }
}
