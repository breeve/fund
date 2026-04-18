import Foundation
import Combine

class AssetStore: ObservableObject {
    @Published var assets: [Asset] = []
    @Published var filter: AssetFilter = AssetFilter()

    private let storage = LocalStorage.shared
    private let dataFile = "assets.json"

    var filteredAssets: [Asset] {
        assets.filter { asset in
            if let category = filter.category, asset.category != category {
                return false
            }
            if !filter.searchText.isEmpty {
                return asset.name.localizedCaseInsensitiveContains(filter.searchText) ||
                       asset.subType.localizedCaseInsensitiveContains(filter.searchText)
            }
            return true
        }
    }

    var totalAssets: Double {
        assets.filter { $0.category != .liability }.reduce(0) { $0 + $1.amount }
    }

    var totalLiabilities: Double {
        assets.filter { $0.category == .liability }.reduce(0) { $0 + $1.amount }
    }

    var netWorth: Double {
        totalAssets - totalLiabilities
    }

    var assetsByCategory: [AssetCategory: Double] {
        var result: [AssetCategory: Double] = [:]
        for asset in assets where asset.category != .liability {
            result[asset.category, default: 0] += asset.amount
        }
        return result
    }

    init() {
        load()
    }

    func load() {
        assets = storage.load([Asset].self, from: dataFile) ?? []
    }

    func save() {
        storage.save(assets, to: dataFile)
    }

    func add(_ asset: Asset) {
        assets.append(asset)
        save()
    }

    func update(_ asset: Asset) {
        if let index = assets.firstIndex(where: { $0.id == asset.id }) {
            assets[index] = asset
            save()
        }
    }

    func delete(_ asset: Asset) {
        assets.removeAll { $0.id == asset.id }
        save()
    }

    func delete(at offsets: IndexSet) {
        let idsToDelete = offsets.map { filteredAssets[$0].id }
        assets.removeAll { idsToDelete.contains($0.id) }
        save()
    }
}
