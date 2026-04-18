import SwiftUI
import Charts

struct OverviewView: View {
    @EnvironmentObject var assetStore: AssetStore

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Key Metrics
                HStack(spacing: 20) {
                    MetricCard(
                        title: "Total Assets",
                        value: assetStore.totalAssets,
                        icon: "building.columns.fill",
                        color: .green
                    )
                    MetricCard(
                        title: "Total Liabilities",
                        value: assetStore.totalLiabilities,
                        icon: "creditcard.fill",
                        color: .red
                    )
                    MetricCard(
                        title: "Net Worth",
                        value: assetStore.netWorth,
                        icon: "chart.line.uptrend.xyaxis",
                        color: .blue
                    )
                }
                .padding(.horizontal)

                // Asset Composition Chart
                VStack(alignment: .leading, spacing: 12) {
                    Text("Asset Composition")
                        .font(.headline)
                        .padding(.horizontal)

                    if #available(macOS 14.0, *) {
                        CompositionChartView(data: assetStore.assetsByCategory)
                            .frame(height: 300)
                            .padding()
                            .background(Color(NSColor.controlBackgroundColor))
                            .cornerRadius(12)
                    } else {
                        SimplePieChartView(data: assetStore.assetsByCategory)
                            .frame(height: 300)
                            .padding()
                            .background(Color(NSColor.controlBackgroundColor))
                            .cornerRadius(12)
                    }
                }
                .padding(.horizontal)

                // Category Breakdown
                VStack(alignment: .leading, spacing: 12) {
                    Text("Category Breakdown")
                        .font(.headline)
                        .padding(.horizontal)

                    ForEach(AssetCategory.allCases.filter { $0 != .liability }, id: \.self) { category in
                        CategoryRow(
                            category: category,
                            amount: assetStore.assetsByCategory[category] ?? 0,
                            total: assetStore.totalAssets
                        )
                    }
                }
                .padding(.horizontal)
            }
            .padding(.vertical)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(NSColor.windowBackgroundColor))
    }
}

struct MetricCard: View {
    let title: String
    let value: Double
    let icon: String
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: icon)
                    .foregroundColor(color)
                Text(title)
                    .foregroundColor(.secondary)
            }
            .font(.caption)

            Text(formatCurrency(value))
                .font(.title2)
                .fontWeight(.semibold)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(Color(NSColor.controlBackgroundColor))
        .cornerRadius(12)
    }

    private func formatCurrency(_ value: Double) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "CNY"
        formatter.maximumFractionDigits = 0
        return formatter.string(from: NSNumber(value: value)) ?? "¥0"
    }
}

struct CategoryRow: View {
    let category: AssetCategory
    let amount: Double
    let total: Double

    var percentage: Double {
        guard total > 0 else { return 0 }
        return amount / total * 100
    }

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: category.icon)
                .foregroundColor(colorForCategory(category))
                .frame(width: 24)

            Text(category.rawValue)
                .font(.subheadline)

            Spacer()

            Text(formatCurrency(amount))
                .font(.subheadline)
                .fontWeight(.medium)

            Text(String(format: "%.1f%%", percentage))
                .font(.caption)
                .foregroundColor(.secondary)
                .frame(width: 50, alignment: .trailing)
        }
        .padding(.horizontal)
        .padding(.vertical, 8)
        .background(Color(NSColor.controlBackgroundColor))
        .cornerRadius(8)
    }

    private func formatCurrency(_ value: Double) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "CNY"
        formatter.maximumFractionDigits = 0
        return formatter.string(from: NSNumber(value: value)) ?? "¥0"
    }

    private func colorForCategory(_ category: AssetCategory) -> Color {
        switch category {
        case .liquid: return .blue
        case .fixed: return .orange
        case .financial: return .green
        case .protection: return .purple
        case .liability: return .red
        }
    }
}

@available(macOS 14.0, *)
struct CompositionChartView: View {
    let data: [AssetCategory: Double]

    var chartData: [(category: AssetCategory, amount: Double)] {
        data
            .filter { $0.key != .liability }
            .map { ($0.key, $0.value) }
            .sorted { $0.amount > $1.amount }
    }

    var body: some View {
        Chart(chartData, id: \.category) { item in
            SectorMark(
                angle: .value("Amount", item.amount),
                innerRadius: .ratio(0.5),
                angularInset: 1.5
            )
            .foregroundStyle(by: .value("Category", item.category.rawValue))
            .cornerRadius(4)
        }
        .chartLegend(position: .trailing, alignment: .center)
    }
}

struct SimplePieChartView: View {
    let data: [AssetCategory: Double]

    var slices: [(category: AssetCategory, amount: Double, startAngle: Double, endAngle: Double)] {
        let total = data.filter { $0.key != .liability }.values.reduce(0, +)
        var currentAngle = 0.0
        return data
            .filter { $0.key != .liability }
            .map { category, amount in
                let angle = total > 0 ? amount / total * 360 : 0
                let start = currentAngle
                currentAngle += angle
                return (category, amount, start, currentAngle)
            }
            .sorted { $0.amount > $1.amount }
    }

    var body: some View {
        GeometryReader { geometry in
            let size = min(geometry.size.width, geometry.size.height)
            ZStack {
                ForEach(slices, id: \.category) { slice in
                    PieSlice(
                        startAngle: .degrees(slice.startAngle - 90),
                        endAngle: .degrees(slice.endAngle - 90)
                    )
                    .fill(colorForCategory(slice.category))
                }

                // Legend
                VStack(alignment: .leading, spacing: 8) {
                    ForEach(slices, id: \.category) { slice in
                        HStack(spacing: 8) {
                            Circle()
                                .fill(colorForCategory(slice.category))
                                .frame(width: 10, height: 10)
                            Text(slice.category.rawValue)
                                .font(.caption)
                            Spacer()
                            Text(String(format: "%.1f%%", slice.amount / (data.values.reduce(0, +)) * 100))
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                    }
                }
                .padding()
                .background(Color(NSColor.windowBackgroundColor).opacity(0.9))
                .cornerRadius(8)
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topTrailing)
            }
            .frame(width: size, height: size)
            .position(x: geometry.size.width / 2, y: geometry.size.height / 2)
        }
    }

    private func colorForCategory(_ category: AssetCategory) -> Color {
        switch category {
        case .liquid: return .blue
        case .fixed: return .orange
        case .financial: return .green
        case .protection: return .purple
        case .liability: return .red
        }
    }
}

struct PieSlice: Shape {
    let startAngle: Angle
    let endAngle: Angle

    func path(in rect: CGRect) -> Path {
        var path = Path()
        let center = CGPoint(x: rect.midX, y: rect.midY)
        let radius = min(rect.width, rect.height) / 2
        let innerRadius = radius * 0.5

        path.move(to: CGPoint(
            x: center.x + innerRadius * cos(CGFloat(startAngle.radians)),
            y: center.y + innerRadius * sin(CGFloat(startAngle.radians))
        ))

        path.addArc(center: center, radius: radius, startAngle: startAngle, endAngle: endAngle, clockwise: false)

        path.addLine(to: CGPoint(
            x: center.x + innerRadius * cos(CGFloat(endAngle.radians)),
            y: center.y + innerRadius * sin(CGFloat(endAngle.radians))
        ))

        path.addArc(center: center, radius: innerRadius, startAngle: endAngle, endAngle: startAngle, clockwise: true)

        path.closeSubpath()

        return path
    }
}
