import Foundation

struct Fund: Identifiable, Codable {
    var id: String { code }
    var code: String
    var name: String
    var nav: Double
    var accumulatedNav: Double
    var dailyChange: Double
    var dailyChangePercent: Double
    var manager: String
    var company: String
    var category: String
    var scale: Double
    var establishedDate: String

    init(
        code: String,
        name: String,
        nav: Double = 0,
        accumulatedNav: Double = 0,
        dailyChange: Double = 0,
        dailyChangePercent: Double = 0,
        manager: String = "",
        company: String = "",
        category: String = "",
        scale: Double = 0,
        establishedDate: String = ""
    ) {
        self.code = code
        self.name = name
        self.nav = nav
        self.accumulatedNav = accumulatedNav
        self.dailyChange = dailyChange
        self.dailyChangePercent = dailyChangePercent
        self.manager = manager
        self.company = company
        self.category = category
        self.scale = scale
        self.establishedDate = establishedDate
    }
}

struct FundHolding: Identifiable, Codable {
    var id: UUID = UUID()
    var name: String
    var code: String
    var percent: Double
    var shares: Double
    var marketValue: Double
}

struct FundSearchResult: Identifiable, Codable {
    var id: String { code }
    var code: String
    var name: String
    var category: String
}

enum RiskRating: Int, Codable, CaseIterable {
    case oneStar = 1
    case twoStars = 2
    case threeStars = 3
    case fourStars = 4
    case fiveStars = 5

    var description: String {
        switch self {
        case .oneStar: return "Low Risk"
        case .twoStars: return "Below Average"
        case .threeStars: return "Average"
        case .fourStars: return "Above Average"
        case .fiveStars: return "High Risk"
        }
    }
}

struct FundDiagnosis {
    var fund: Fund
    var riskRating: RiskRating
    var holdings: [FundHolding]
    var industryDistribution: [String: Double]
    var overlapWithPortfolio: Double
    var recommendedAllocation: ClosedRange<Double>
    var analysisDate: Date

    init(
        fund: Fund,
        riskRating: RiskRating = .threeStars,
        holdings: [FundHolding] = [],
        industryDistribution: [String: Double] = [:],
        overlapWithPortfolio: Double = 0,
        recommendedAllocation: ClosedRange<Double> = 5...15,
        analysisDate: Date = Date()
    ) {
        self.fund = fund
        self.riskRating = riskRating
        self.holdings = holdings
        self.industryDistribution = industryDistribution
        self.overlapWithPortfolio = overlapWithPortfolio
        self.recommendedAllocation = recommendedAllocation
        self.analysisDate = analysisDate
    }
}
