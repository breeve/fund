import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import '../models/asset.dart';
import '../services/storage.dart';

final storageServiceProvider = Provider<StorageService>((ref) => StorageService());

final assetStoreProvider =
    StateNotifierProvider<AssetStoreNotifier, AssetState>((ref) {
  return AssetStoreNotifier(ref.watch(storageServiceProvider));
});

class AssetState {
  final List<BaseAsset> assets;
  final bool isLoading;
  final String? error;
  final AssetCategory? filterCategory;
  final String? searchQuery;

  AssetState({
    this.assets = const [],
    this.isLoading = false,
    this.error,
    this.filterCategory,
    this.searchQuery,
  });

  AssetState copyWith({
    List<BaseAsset>? assets,
    bool? isLoading,
    String? error,
    AssetCategory? filterCategory,
    String? searchQuery,
  }) =>
      AssetState(
        assets: assets ?? this.assets,
        isLoading: isLoading ?? this.isLoading,
        error: error,
        filterCategory: filterCategory ?? this.filterCategory,
        searchQuery: searchQuery ?? this.searchQuery,
      );

  List<BaseAsset> get filteredAssets {
    var result = assets;
    if (filterCategory != null) {
      result = result.where((a) => a.category == filterCategory).toList();
    }
    if (searchQuery != null && searchQuery!.isNotEmpty) {
      final query = searchQuery!.toLowerCase();
      result = result.where((a) {
        return a.name.toLowerCase().contains(query) ||
            a.subType.toLowerCase().contains(query) ||
            a.tags.any((t) => t.toLowerCase().contains(query));
      }).toList();
    }
    return result;
  }

  Map<AssetCategory, double> get categoryBreakdown {
    final breakdown = <AssetCategory, double>{};
    for (final asset in assets) {
      double value = 0;
      if (asset is PublicFundAsset) {
        value = asset.total;
      } else if (asset is PrivateFundAsset) {
        value = asset.total;
      } else if (asset is StrategyAsset) {
        value = asset.total;
      } else if (asset is FixedTermAsset) {
        value = asset.investmentAmount;
      } else if (asset is LiquidAsset) {
        value = asset.total;
      } else if (asset is DerivativeAsset) {
        value = asset.total;
      }
      breakdown[asset.category] = (breakdown[asset.category] ?? 0) + value;
    }
    return breakdown;
  }

  double get totalAssets {
    return categoryBreakdown.values.fold(0, (sum, val) => sum + val);
  }
}

class AssetStoreNotifier extends StateNotifier<AssetState> {
  final StorageService _storage;
  final _uuid = const Uuid();

  AssetStoreNotifier(this._storage) : super(AssetState());

  Future<void> loadAssets() async {
    state = state.copyWith(isLoading: true);
    try {
      final assets = await _storage.getAssets();
      state = state.copyWith(assets: assets, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<void> addAsset(BaseAsset asset) async {
    final now = DateTime.now().toIso8601String();
    final newAsset = _copyAssetWithDates(asset, now, now);
    await _storage.saveAsset(newAsset);
    state = state.copyWith(assets: [...state.assets, newAsset]);
  }

  Future<void> updateAsset(BaseAsset asset) async {
    final updated = _copyAssetWithDates(
      asset,
      asset.createdAt,
      DateTime.now().toIso8601String(),
    );
    await _storage.saveAsset(updated);
    state = state.copyWith(
      assets: state.assets.map((a) => a.id == asset.id ? updated : a).toList(),
    );
  }

  Future<void> deleteAsset(String id) async {
    await _storage.deleteAsset(id);
    state = state.copyWith(
      assets: state.assets.where((a) => a.id != id).toList(),
    );
  }

  void setFilter(AssetCategory? category) {
    state = state.copyWith(filterCategory: category);
  }

  void setSearchQuery(String? query) {
    state = state.copyWith(searchQuery: query);
  }

  String generateId() => _uuid.v4();

  BaseAsset _copyAssetWithDates(
    BaseAsset asset,
    String createdAt,
    String updatedAt,
  ) {
    // This is a simplified version - in production you'd need to handle each type
    if (asset is PublicFundAsset) {
      return asset;
    }
    return asset;
  }
}
