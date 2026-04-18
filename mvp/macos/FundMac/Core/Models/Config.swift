import Foundation

enum DataSource: String, Codable, CaseIterable, Identifiable {
    case eastmoney = "东方财富"
    case tushare = "Tushare Pro"
    case akshare = "AKShare"
    case yahoo = "Yahoo Finance"

    var id: String { rawValue }
}

enum LLMProvider: String, Codable, CaseIterable, Identifiable {
    case openai = "OpenAI"
    case anthropic = "Anthropic"
    case deepseek = "DeepSeek"
    case ollama = "Ollama"
    case groq = "Groq"

    var id: String { rawValue }
}

struct AppConfig: Codable {
    var dataSource: DataSource
    var llmProvider: LLMProvider
    var llmApiKey: String
    var llmBaseUrl: String
    var theme: String
    var locale: String

    init(
        dataSource: DataSource = .eastmoney,
        llmProvider: LLMProvider = .openai,
        llmApiKey: String = "",
        llmBaseUrl: String = "",
        theme: String = "system",
        locale: String = "zh-CN"
    ) {
        self.dataSource = dataSource
        self.llmProvider = llmProvider
        self.llmApiKey = llmApiKey
        self.llmBaseUrl = llmBaseUrl
        self.theme = theme
        self.locale = locale
    }
}
