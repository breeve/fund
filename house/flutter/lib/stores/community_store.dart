import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/community.dart';
import '../services/house_api.dart';
import '../services/storage.dart';
import 'house_api_service_provider.dart';
import 'storage_service_provider.dart';

class CommunityState {
  final List<Community> communities;
  final bool isLoading;
  final String? error;
  final int? selectedBlockId;
  final int? selectedLifeCircleId;
  final double? priceMin;
  final double? priceMax;
  final String searchQuery;

  const CommunityState({
    this.communities = const [],
    this.isLoading = false,
    this.error,
    this.selectedBlockId,
    this.selectedLifeCircleId,
    this.priceMin,
    this.priceMax,
    this.searchQuery = '',
  });

  CommunityState copyWith({
    List<Community>? communities,
    bool? isLoading,
    String? error,
    int? selectedBlockId,
    int? selectedLifeCircleId,
    double? priceMin,
    double? priceMax,
    String? searchQuery,
    bool clearBlockId = false,
    bool clearLifeCircleId = false,
    bool clearPriceMin = false,
    bool clearPriceMax = false,
  }) =>
      CommunityState(
        communities: communities ?? this.communities,
        isLoading: isLoading ?? this.isLoading,
        error: error,
        selectedBlockId: clearBlockId ? null : (selectedBlockId ?? this.selectedBlockId),
        selectedLifeCircleId: clearLifeCircleId ? null : (selectedLifeCircleId ?? this.selectedLifeCircleId),
        priceMin: clearPriceMin ? null : (priceMin ?? this.priceMin),
        priceMax: clearPriceMax ? null : (priceMax ?? this.priceMax),
        searchQuery: searchQuery ?? this.searchQuery,
      );

  List<Community> get filteredCommunities {
    var result = communities;

    if (selectedBlockId != null) {
      result = result.where((c) => c.blockId == selectedBlockId).toList();
    }
    if (selectedLifeCircleId != null) {
      result = result.where((c) => c.lifeCircleId == selectedLifeCircleId).toList();
    }
    if (priceMin != null) {
      result = result.where((c) => (c.dealPrice ?? 0) >= priceMin!).toList();
    }
    if (priceMax != null) {
      result = result.where((c) => (c.dealPrice ?? double.infinity) <= priceMax!).toList();
    }
    if (searchQuery.isNotEmpty) {
      final query = searchQuery.toLowerCase();
      result = result.where((c) =>
          c.name.toLowerCase().contains(query) ||
          (c.officialName?.toLowerCase().contains(query) ?? false) ||
          (c.address?.toLowerCase().contains(query) ?? false)).toList();
    }

    return result;
  }
}

class CommunityStoreNotifier extends StateNotifier<CommunityState> {
  final HouseApiService _api;
  final StorageService _storage;

  CommunityStoreNotifier(this._api, this._storage)
      : super(const CommunityState());

  Future<void> loadCommunities() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final communities = await _api.getCommunities(
        blockId: state.selectedBlockId,
        lifeCircleId: state.selectedLifeCircleId,
        priceMin: state.priceMin,
        priceMax: state.priceMax,
      );
      await _storage.saveCommunities(communities);
      state = state.copyWith(communities: communities, isLoading: false);
    } on Exception catch (e) {
      final cached = _storage.getCommunities();
      state = state.copyWith(
        communities: cached,
        isLoading: false,
        error: '加载失败: $e',
      );
    }
  }

  void setFilters({
    int? blockId,
    int? lifeCircleId,
    double? priceMin,
    double? priceMax,
    bool clearBlockId = false,
    bool clearLifeCircleId = false,
    bool clearPriceMin = false,
    bool clearPriceMax = false,
  }) {
    state = state.copyWith(
      selectedBlockId: blockId,
      selectedLifeCircleId: lifeCircleId,
      priceMin: priceMin,
      priceMax: priceMax,
      clearBlockId: clearBlockId,
      clearLifeCircleId: clearLifeCircleId,
      clearPriceMin: clearPriceMin,
      clearPriceMax: clearPriceMax,
    );
  }

  void setSearchQuery(String query) {
    state = state.copyWith(searchQuery: query);
  }

  void clearFilters() {
    state = state.copyWith(
      clearBlockId: true,
      clearLifeCircleId: true,
      clearPriceMin: true,
      clearPriceMax: true,
      searchQuery: '',
    );
  }
}

final communityStoreProvider =
    StateNotifierProvider<CommunityStoreNotifier, CommunityState>((ref) {
  return CommunityStoreNotifier(
    ref.watch(houseApiServiceProvider),
    ref.watch(storageServiceProvider),
  );
});
