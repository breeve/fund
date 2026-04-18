import SwiftUI

struct AssetsView: View {
    @EnvironmentObject var assetStore: AssetStore
    @State private var showingAddSheet = false
    @State private var editingAsset: Asset?
    @State private var selectedCategory: AssetCategory?

    var body: some View {
        VStack(spacing: 0) {
            // Toolbar
            HStack {
                Picker("Category", selection: $selectedCategory) {
                    Text("All").tag(nil as AssetCategory?)
                    ForEach(AssetCategory.allCases.filter { $0 != .liability }, id: \.self) { category in
                        Text(category.rawValue).tag(category as AssetCategory?)
                    }
                }
                .pickerStyle(.segmented)
                .frame(width: 400)

                Spacer()

                Button(action: { showingAddSheet = true }) {
                    Label("Add Asset", systemImage: "plus")
                }
            }
            .padding()
            .background(Color(NSColor.controlBackgroundColor))

            // Asset List
            if assetStore.filteredAssets.isEmpty {
                VStack(spacing: 16) {
                    Image(systemName: "building.columns")
                        .font(.system(size: 48))
                        .foregroundColor(.secondary)
                    Text("No Assets Yet")
                        .font(.title2)
                    Text("Add your first asset to get started")
                        .foregroundColor(.secondary)
                    Button("Add Asset") {
                        showingAddSheet = true
                    }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                List {
                    ForEach(assetStore.filteredAssets) { asset in
                        AssetRow(asset: asset)
                            .onTapGesture {
                                editingAsset = asset
                            }
                    }
                    .onDelete { offsets in
                        assetStore.delete(at: offsets)
                    }
                }
                .listStyle(.inset)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .onChange(of: selectedCategory) { _, newValue in
            assetStore.filter.category = newValue
        }
        .sheet(isPresented: $showingAddSheet) {
            AssetFormView(mode: .add)
        }
        .sheet(item: $editingAsset) { asset in
            AssetFormView(mode: .edit(asset))
        }
    }
}

struct AssetRow: View {
    let asset: Asset

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: asset.category.icon)
                .foregroundColor(colorForCategory(asset.category))
                .frame(width: 32, height: 32)
                .background(colorForCategory(asset.category).opacity(0.1))
                .cornerRadius(8)

            VStack(alignment: .leading, spacing: 4) {
                Text(asset.name)
                    .font(.subheadline)
                    .fontWeight(.medium)
                Text(asset.subType.isEmpty ? asset.category.rawValue : asset.subType)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Spacer()

            Text(formatCurrency(asset.amount))
                .font(.subheadline)
                .fontWeight(.semibold)

            Image(systemName: "chevron.right")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding(.vertical, 8)
        .contentShape(Rectangle())
    }

    private func formatCurrency(_ value: Double) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = asset.currency
        formatter.maximumFractionDigits = 2
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

enum AssetFormMode {
    case add
    case edit(Asset)
}

struct AssetFormView: View {
    @EnvironmentObject var assetStore: AssetStore
    @Environment(\.dismiss) var dismiss

    let mode: AssetFormMode

    @State private var name = ""
    @State private var amount = ""
    @State private var category: AssetCategory = .liquid
    @State private var subType = ""
    @State private var tags: [String] = []
    @State private var newTag = ""

    var isEditing: Bool {
        if case .edit = mode { return true }
        return false
    }

    var body: some View {
        VStack(spacing: 20) {
            Text(isEditing ? "Edit Asset" : "Add New Asset")
                .font(.title2)
                .fontWeight(.semibold)

            Form {
                TextField("Asset Name", text: $name)
                TextField("Amount", text: $amount)

                Picker("Category", selection: $category) {
                    ForEach(AssetCategory.allCases.filter { $0 != .liability }, id: \.self) { cat in
                        Text(cat.rawValue).tag(cat)
                    }
                }

                TextField("Sub Type (optional)", text: $subType)

                HStack {
                    TextField("Add Tag", text: $newTag)
                    Button("Add") {
                        if !newTag.isEmpty {
                            tags.append(newTag)
                            newTag = ""
                        }
                    }
                }

                if !tags.isEmpty {
                    FlowLayout(spacing: 4) {
                        ForEach(tags, id: \.self) { tag in
                            TagChip(tag: tag) {
                                tags.removeAll { $0 == tag }
                            }
                        }
                    }
                }
            }
            .frame(maxWidth: 400)

            HStack {
                Button("Cancel") {
                    dismiss()
                }
                .keyboardShortcut(.cancelAction)

                Button(isEditing ? "Save" : "Add") {
                    saveAsset()
                    dismiss()
                }
                .keyboardShortcut(.defaultAction)
                .disabled(name.isEmpty || amount.isEmpty)
            }
        }
        .padding(24)
        .onAppear {
            if case .edit(let asset) = mode {
                name = asset.name
                amount = String(format: "%.2f", asset.amount)
                category = asset.category
                subType = asset.subType
                tags = asset.tags
            }
        }
    }

    private func saveAsset() {
        guard let amountValue = Double(amount) else { return }

        switch mode {
        case .add:
            let asset = Asset(
                category: category,
                name: name,
                amount: amountValue,
                subType: subType,
                tags: tags
            )
            assetStore.add(asset)
        case .edit(let existingAsset):
            var updatedAsset = existingAsset
            updatedAsset.name = name
            updatedAsset.amount = amountValue
            updatedAsset.category = category
            updatedAsset.subType = subType
            updatedAsset.tags = tags
            updatedAsset.updatedAt = Date()
            assetStore.update(updatedAsset)
        }
    }
}

struct TagChip: View {
    let tag: String
    let onRemove: () -> Void

    var body: some View {
        HStack(spacing: 4) {
            Text(tag)
                .font(.caption)
            Button(action: onRemove) {
                Image(systemName: "xmark")
                    .font(.caption2)
            }
            .buttonStyle(.plain)
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(Color.accentColor.opacity(0.2))
        .cornerRadius(12)
    }
}

struct FlowLayout: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let result = FlowResult(in: proposal.width ?? 0, subviews: subviews, spacing: spacing)
        return CGSize(width: proposal.width ?? 0, height: result.height)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let result = FlowResult(in: bounds.width, subviews: subviews, spacing: spacing)
        for (index, subview) in subviews.enumerated() {
            subview.place(at: CGPoint(x: bounds.minX + result.positions[index].x, y: bounds.minY + result.positions[index].y), proposal: .unspecified)
        }
    }

    struct FlowResult {
        var positions: [CGPoint] = []
        var height: CGFloat = 0

        init(in maxWidth: CGFloat, subviews: Subviews, spacing: CGFloat) {
            var currentX: CGFloat = 0
            var currentY: CGFloat = 0
            var lineHeight: CGFloat = 0

            for subview in subviews {
                let size = subview.sizeThatFits(.unspecified)

                if currentX + size.width > maxWidth && currentX > 0 {
                    currentX = 0
                    currentY += lineHeight + spacing
                    lineHeight = 0
                }

                positions.append(CGPoint(x: currentX, y: currentY))
                lineHeight = max(lineHeight, size.height)
                currentX += size.width + spacing
            }

            height = currentY + lineHeight
        }
    }
}
