import SwiftUI
import WebKit

struct ArgonSceneView: NSViewRepresentable {
    func makeNSView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.preferences.isElementFullscreenEnabled = false
        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.setValue(false, forKey: "drawsBackground")
        webView.allowsBackForwardNavigationGestures = false
        webView.loadFileURL(
            Bundle.module.url(forResource: "index", withExtension: "html", subdirectory: "Web")!,
            allowingReadAccessTo: Bundle.module.resourceURL!.appendingPathComponent("Web")
        )
        return webView
    }

    func updateNSView(_ nsView: WKWebView, context: Context) {}
}
