import Foundation
import Combine

class ConfigStore: ObservableObject {
    @Published var config: AppConfig

    private let storage = LocalStorage.shared
    private let configFile = "config.json"

    init() {
        config = storage.load(AppConfig.self, from: configFile) ?? AppConfig()
    }

    func save() {
        storage.save(config, to: configFile)
    }

    func updateDataSource(_ source: DataSource) {
        config.dataSource = source
        save()
    }

    func updateLLM(provider: LLMProvider, apiKey: String, baseUrl: String) {
        config.llmProvider = provider
        config.llmApiKey = apiKey
        config.llmBaseUrl = baseUrl
        save()
    }

    func updateTheme(_ theme: String) {
        config.theme = theme
        save()
    }

    func updateLocale(_ locale: String) {
        config.locale = locale
        save()
    }
}
