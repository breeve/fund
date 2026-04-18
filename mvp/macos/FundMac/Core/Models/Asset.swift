import Foundation

enum AssetCategory: String, Codable, CaseIterable, Identifiable {
    case liquid = "流动资产"
    case fixed = "固定资产"
    case financial = "金融投资"
    case protection = "保障类"
    case liability = "负债"

    var id: String { rawValue }

    var icon: String {
        switch self {
        case .liquid: return "dollarsign.circle.fill"
        case .fixed: return "house.fill"
        case .financial: return "chart.line.uptrend.xyaxis"
        case .protection: return "shield.fill"
        case .liability: return "creditcard.fill"
        }
    }

    var color: String {
        switch self {
        case .liquid: return "blue"
        case .fixed: return "orange"
        case .financial: return "green"
        case .protection: return "purple"
        case .liability: return "red"
        }
    }
}

struct Asset: Identifiable, Codable, Equatable {
    var id: UUID
    var category: AssetCategory
    var name: String
    var amount: Double
    var currency: String
    var subType: String
    var fields: [String: String]
    var tags: [String]
    var createdAt: Date
    var updatedAt: Date

    init(
        id: UUID = UUID(),
        category: AssetCategory,
        name: String,
        amount: Double,
        currency: String = "CNY",
        subType: String = "",
        fields: [String: String] = [:],
        tags: [String] = [],
        createdAt: Date = Date(),
        updatedAt: Date = Date()
    ) {
        self.id = id
        self.category = category
        self.name = name
        self.amount = amount
        self.currency = currency
        self.subType = subType
        self.fields = fields
        self.tags = tags
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }
}

struct AssetFilter {
    var category: AssetCategory?
    var searchText: String = ""
}
