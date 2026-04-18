import SwiftUI
import Charts

struct FundDiagnosisView: View {
    @EnvironmentObject var fundStore: FundStore
    @State private var searchText = ""

    var body: some View {
        HSplitView {
            // Left: Search
            VStack(spacing: 0) {
                // Search
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.secondary)
                    TextField("Search fund by name or code", text: $searchText)
                        .textFieldStyle(.plain)
                        .onSubmit {
                            Task {
                                await fundStore.searchFunds(keyword: searchText)
                            }
                        }
                    if !searchText.isEmpty {
                        Button(action: {
                            searchText = ""
                            fundStore.clearSearch()
                        }) {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(.secondary)
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(10)
                .background(Color(NSColor.controlBackgroundColor))
                .cornerRadius(8)
                .padding()

                Divider()

                // Results
                if fundStore.isLoading {
                    ProgressView()
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else if fundStore.searchResults.isEmpty {
                    VStack(spacing: 12) {
                        Image(systemName: "doc.text.magnifyingglass")
                            .font(.system(size: 40))
                            .foregroundColor(.secondary)
                        Text("Search for a fund")
                            .foregroundColor(.secondary)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else {
                    List(fundStore.searchResults) { result in
                        FundSearchResultRow(result: result)
                            .onTapGesture {
                                Task {
                                    await fundStore.fetchFundInfo(code: result.code)
                                }
                            }
                    }
                    .listStyle(.inset)
                }
            }
            .frame(minWidth: 280, maxWidth: 350)

            // Right: Fund Detail
            if let fund = fundStore.selectedFund {
                FundDetailView(fund: fund, diagnosis: fundStore.diagnosis)
                    .frame(maxWidth: .infinity)
            } else {
                VStack(spacing: 16) {
                    Image(systemName: "doc.text")
                        .font(.system(size: 48))
                        .foregroundColor(.secondary)
                    Text("Select a fund to view details")
                        .foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .onChange(of: searchText) { _, newValue in
            Task {
                try? await Task.sleep(nanoseconds: 300_000_000)
                if searchText == newValue {
                    await fundStore.searchFunds(keyword: newValue)
                }
            }
        }
    }
}

struct FundSearchResultRow: View {
    let result: FundSearchResult

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(result.name)
                    .font(.subheadline)
                    .fontWeight(.medium)
                Text(result.code)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            Spacer()
            Text(result.category)
                .font(.caption)
                .padding(.horizontal, 6)
                .padding(.vertical, 2)
                .background(Color.accentColor.opacity(0.1))
                .cornerRadius(4)
        }
        .padding(.vertical, 4)
        .contentShape(Rectangle())
    }
}

struct FundDetailView: View {
    @EnvironmentObject var fundStore: FundStore
    let fund: Fund
    let diagnosis: FundDiagnosis?

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                // Header
                VStack(alignment: .leading, spacing: 8) {
                    Text(fund.name)
                        .font(.title2)
                        .fontWeight(.semibold)
                    Text("Code: \(fund.code)")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                // NAV Info
                HStack(spacing: 20) {
                    VStack(alignment: .leading) {
                        Text("NAV")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        Text(String(format: "%.4f", fund.nav))
                            .font(.title3)
                            .fontWeight(.semibold)
                    }
                    VStack(alignment: .leading) {
                        Text("Accumulated NAV")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        Text(String(format: "%.4f", fund.accumulatedNav))
                            .font(.title3)
                    }
                    VStack(alignment: .leading) {
                        Text("Daily Change")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        HStack {
                            Text(String(format: "%+.4f (%.2f%%)", fund.dailyChange, fund.dailyChangePercent))
                                .foregroundColor(fund.dailyChange >= 0 ? .green : .red)
                        }
                        .font(.title3)
                    }
                }
                .padding()
                .background(Color(NSColor.controlBackgroundColor))
                .cornerRadius(12)

                // Fund Info
                LazyVGrid(columns: [
                    GridItem(.flexible()),
                    GridItem(.flexible()),
                    GridItem(.flexible())
                ], spacing: 12) {
                    InfoCard(title: "Manager", value: fund.manager)
                    InfoCard(title: "Company", value: fund.company)
                    InfoCard(title: "Category", value: fund.category)
                    InfoCard(title: "Scale", value: String(format: "%.2fB", fund.scale))
                    InfoCard(title: "Established", value: fund.establishedDate)
                }

                // Risk Rating
                if let diagnosis = diagnosis {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Risk Rating")
                            .font(.headline)
                        HStack {
                            ForEach(1...5, id: \.self) { star in
                                Image(systemName: star <= diagnosis.riskRating.rawValue ? "star.fill" : "star")
                                    .foregroundColor(.yellow)
                            }
                            Text(diagnosis.riskRating.description)
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                    }

                    // Holdings
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Top Holdings")
                            .font(.headline)

                        ForEach(diagnosis.holdings.prefix(5)) { holding in
                            HStack {
                                Text(holding.name)
                                    .font(.subheadline)
                                Text("(\(holding.code))")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                                Spacer()
                                Text(String(format: "%.1f%%", holding.percent))
                                    .font(.subheadline)
                                    .fontWeight(.medium)
                            }
                            .padding(.vertical, 4)
                        }
                    }

                    // Industry Distribution
                    if #available(macOS 14.0, *) {
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Industry Distribution")
                                .font(.headline)

                            Chart(diagnosis.industryDistribution.sorted { $0.value > $1.value }, id: \.key) { item in
                                BarMark(
                                    x: .value("Percentage", item.value),
                                    y: .value("Industry", item.key)
                                )
                                .foregroundStyle(Color.accentColor.gradient)
                            }
                            .frame(height: 200)
                        }
                    }

                    // Portfolio Overlap
                    HStack {
                        Text("Portfolio Overlap")
                            .font(.headline)
                        Spacer()
                        Text(String(format: "%.1f%%", diagnosis.overlapWithPortfolio))
                            .font(.title3)
                            .fontWeight(.semibold)
                            .foregroundColor(diagnosis.overlapWithPortfolio > 20 ? .orange : .green)
                    }

                    // Recommended Allocation
                    HStack {
                        Text("Recommended Allocation")
                            .font(.headline)
                        Spacer()
                        Text("\(Int(diagnosis.recommendedAllocation.lowerBound))% - \(Int(diagnosis.recommendedAllocation.upperBound))%")
                            .font(.title3)
                            .fontWeight(.semibold)
                    }
                }

                Spacer()
            }
            .padding(24)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .onAppear {
            Task {
                await fundStore.diagnoseFund(fund)
            }
        }
    }
}

struct InfoCard: View {
    let title: String
    let value: String

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
            Text(value)
                .font(.subheadline)
                .fontWeight(.medium)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(10)
        .background(Color(NSColor.controlBackgroundColor))
        .cornerRadius(8)
    }
}
