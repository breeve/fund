import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var configStore: ConfigStore

    var body: some View {
        Form {
            Section {
                Picker("Data Source", selection: $configStore.config.dataSource) {
                    ForEach(DataSource.allCases) { source in
                        Text(source.rawValue).tag(source)
                    }
                }
            } header: {
                Text("Market Data")
            }

            Section {
                Picker("LLM Provider", selection: $configStore.config.llmProvider) {
                    ForEach(LLMProvider.allCases) { provider in
                        Text(provider.rawValue).tag(provider)
                    }
                }

                SecureField("API Key", text: $configStore.config.llmApiKey)

                TextField("Base URL (optional)", text: $configStore.config.llmBaseUrl)
                    .textFieldStyle(.roundedBorder)
            } header: {
                Text("LLM Configuration")
            } footer: {
                Text("Configure your LLM provider for AI-powered fund analysis.")
            }

            Section {
                Picker("Theme", selection: $configStore.config.theme) {
                    Text("System").tag("system")
                    Text("Light").tag("light")
                    Text("Dark").tag("dark")
                }

                Picker("Language", selection: $configStore.config.locale) {
                    Text("简体中文").tag("zh-CN")
                    Text("English").tag("en-US")
                }
            } header: {
                Text("Appearance")
            }

            Section {
                HStack {
                    Text("Data Storage")
                    Spacer()
                    Text(LocalStorage.shared.exportPath().path)
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .textSelection(.enabled)
                }

                Button("Export Data...") {
                    exportData()
                }

                Button("Import Data...") {
                    importData()
                }
            } header: {
                Text("Data")
            }

            Section {
                HStack {
                    Text("Version")
                    Spacer()
                    Text("1.0.0")
                        .foregroundColor(.secondary)
                }
            } header: {
                Text("About")
            }
        }
        .formStyle(.grouped)
        .frame(maxWidth: 500, maxHeight: .infinity)
        .padding()
    }

    private func exportData() {
        let panel = NSSavePanel()
        panel.allowedContentTypes = [.json]
        panel.nameFieldStringValue = "fund_backup.json"

        if panel.runModal() == .OK {
            // Export logic would go here
        }
    }

    private func importData() {
        let panel = NSOpenPanel()
        panel.allowedContentTypes = [.json]

        if panel.runModal() == .OK {
            // Import logic would go here
        }
    }
}
