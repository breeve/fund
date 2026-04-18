import SwiftUI

struct FundMacApp: App {
    @StateObject private var assetStore = AssetStore()
    @StateObject private var fundStore = FundStore()
    @StateObject private var configStore = ConfigStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(assetStore)
                .environmentObject(fundStore)
                .environmentObject(configStore)
        }
        .windowStyle(.automatic)
        .defaultSize(width: 1200, height: 800)
        .commands {
            CommandGroup(replacing: .appSettings) {
                Button("Settings...") {
                    NSApp.sendAction(Selector(("showSettingsWindow:")), to: nil, from: nil)
                }
                .keyboardShortcut(",", modifiers: .command)
            }
        }
    }
}

struct ContentView: View {
    @State private var selectedTab = 0

    var body: some View {
        NavigationSplitView {
            List(selection: $selectedTab) {
                NavigationLink(value: 0) {
                    Label("Overview", systemImage: "chart.pie.fill")
                }
                NavigationLink(value: 1) {
                    Label("Assets", systemImage: "building.columns.fill")
                }
                NavigationLink(value: 2) {
                    Label("Fund Diagnosis", systemImage: "doc.text.magnifyingglass")
                }
                NavigationLink(value: 3) {
                    Label("Settings", systemImage: "gear")
                }
            }
            .listStyle(.sidebar)
            .frame(minWidth: 200)
        } detail: {
            switch selectedTab {
            case 0:
                OverviewView()
            case 1:
                AssetsView()
            case 2:
                FundDiagnosisView()
            case 3:
                SettingsView()
            default:
                OverviewView()
            }
        }
        .frame(minWidth: 900, minHeight: 600)
    }
}
