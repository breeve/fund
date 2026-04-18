import Foundation
import Combine

class FundStore: ObservableObject {
    @Published var searchResults: [FundSearchResult] = []
    @Published var selectedFund: Fund?
    @Published var diagnosis: FundDiagnosis?
    @Published var isLoading = false
    @Published var errorMessage: String?

    private let storage = LocalStorage.shared
    private let cacheFile = "fund_cache.json"
    private var cache: [String: Fund] = [:]

    init() {
        loadCache()
    }

    private func loadCache() {
        cache = storage.load([String: Fund].self, from: cacheFile) ?? [:]
    }

    private func saveCache() {
        storage.save(cache, to: cacheFile)
    }

    func searchFunds(keyword: String) async {
        await MainActor.run { isLoading = true }

        // Simulated search - in production would call real API
        let results = mockSearchFunds(keyword: keyword)

        await MainActor.run {
            searchResults = results
            isLoading = false
        }
    }

    func fetchFundInfo(code: String) async {
        await MainActor.run { isLoading = true }

        // Simulated API call - in production would call real API
        let fund = mockFetchFund(code: code)

        await MainActor.run {
            selectedFund = fund
            cache[code] = fund
            saveCache()
            isLoading = false
        }
    }

    func diagnoseFund(_ fund: Fund) async {
        await MainActor.run { isLoading = true }

        // Simulated diagnosis
        let diagnosis = mockDiagnose(fund: fund)

        await MainActor.run {
            self.diagnosis = diagnosis
            isLoading = false
        }
    }

    func clearSearch() {
        searchResults = []
        selectedFund = nil
        diagnosis = nil
    }

    // MARK: - Mock Data

    private func mockSearchFunds(keyword: String) -> [FundSearchResult] {
        let allFunds = [
            FundSearchResult(code: "000961", name: "天弘沪深300ETF联接A", category: "指数型"),
            FundSearchResult(code: "110022", name: "易方达消费行业股票", category: "股票型"),
            FundSearchResult(code: "001717", name: "景顺长城新兴成长混合", category: "混合型"),
            FundSearchResult(code: "000001", name: "华夏上证50ETF", category: "指数型"),
            FundSearchResult(code: "270042", name: "广发纳斯达克100ETF", category: "指数型"),
            FundSearchResult(code: "163402", name: "兴全趋势投资混合", category: "混合型"),
            FundSearchResult(code: "100032", name: "富国中证红利指数", category: "指数型"),
            FundSearchResult(code: "501009", name: "汇添富中证生物科技", category: "指数型")
        ]

        if keyword.isEmpty {
            return allFunds
        }

        return allFunds.filter {
            $0.name.localizedCaseInsensitiveContains(keyword) ||
            $0.code.contains(keyword)
        }
    }

    private func mockFetchFund(code: String) -> Fund {
        Fund(
            code: code,
            name: "天弘沪深300ETF联接A",
            nav: 1.2345,
            accumulatedNav: 2.3456,
            dailyChange: 0.0123,
            dailyChangePercent: 1.01,
            manager: "张伟",
            company: "天弘基金",
            category: "指数型",
            scale: 56.78,
            establishedDate: "2015-01-20"
        )
    }

    private func mockDiagnose(fund: Fund) -> FundDiagnosis {
        FundDiagnosis(
            fund: fund,
            riskRating: .threeStars,
            holdings: [
                FundHolding(name: "贵州茅台", code: "600519", percent: 8.5, shares: 320000, marketValue: 650000000),
                FundHolding(name: "宁德时代", code: "300750", percent: 6.2, shares: 1200000, marketValue: 520000000),
                FundHolding(name: "中国平安", code: "601318", percent: 4.8, shares: 45000000, marketValue: 380000000),
                FundHolding(name: "招商银行", code: "600036", percent: 4.2, shares: 28000000, marketValue: 320000000),
                FundHolding(name: "美的集团", code: "000333", percent: 3.9, shares: 8500000, marketValue: 290000000)
            ],
            industryDistribution: [
                "食品饮料": 15.2,
                "新能源": 12.8,
                "金融": 18.5,
                "家电": 8.3,
                "医药": 10.2,
                "电子": 14.5,
                "其他": 20.5
            ],
            overlapWithPortfolio: 12.5,
            recommendedAllocation: 5...15
        )
    }
}
