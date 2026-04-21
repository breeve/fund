import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/life_circle.dart';
import '../services/house_api.dart';
import '../services/storage.dart';
import 'house_api_service_provider.dart';
import 'storage_service_provider.dart';

class LifeCircleState {
  final List<LifeCircle> lifeCircles;
  final bool isLoading;
  final String? error;
  final int? selectedBlockId;

  const LifeCircleState({
    this.lifeCircles = const [],
    this.isLoading = false,
    this.error,
    this.selectedBlockId,
  });

  LifeCircleState copyWith({
    List<LifeCircle>? lifeCircles,
    bool? isLoading,
    String? error,
    int? selectedBlockId,
  }) =>
      LifeCircleState(
        lifeCircles: lifeCircles ?? this.lifeCircles,
        isLoading: isLoading ?? this.isLoading,
        error: error,
        selectedBlockId: selectedBlockId ?? this.selectedBlockId,
      );

  List<LifeCircle> get filteredLifeCircles {
    if (selectedBlockId == null) return lifeCircles;
    return lifeCircles.where((c) => c.blockId == selectedBlockId).toList();
  }
}

class LifeCircleStoreNotifier extends StateNotifier<LifeCircleState> {
  final HouseApiService _api;
  final StorageService _storage;

  LifeCircleStoreNotifier(this._api, this._storage)
      : super(const LifeCircleState());

  Future<void> loadLifeCircles({int? blockId}) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final circles = await _api.getLifeCircles(blockId: blockId);
      await _storage.saveLifeCircles(circles);
      state = state.copyWith(lifeCircles: circles, isLoading: false);
    } on Exception catch (e) {
      final cached = _storage.getLifeCircles();
      state = state.copyWith(
        lifeCircles: cached,
        isLoading: false,
        error: '加载失败: $e',
      );
    }
  }

  void selectBlock(int? blockId) {
    state = state.copyWith(selectedBlockId: blockId);
  }
}

final lifeCircleStoreProvider =
    StateNotifierProvider<LifeCircleStoreNotifier, LifeCircleState>((ref) {
  return LifeCircleStoreNotifier(
    ref.watch(houseApiServiceProvider),
    ref.watch(storageServiceProvider),
  );
});
