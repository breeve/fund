import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/block.dart';
import '../services/house_api.dart';
import '../services/storage.dart';
import 'house_api_service_provider.dart';
import 'storage_service_provider.dart';

class BlockState {
  final List<Block> blocks;
  final bool isLoading;
  final String? error;
  final int? selectedDistrictId;

  const BlockState({
    this.blocks = const [],
    this.isLoading = false,
    this.error,
    this.selectedDistrictId,
  });

  BlockState copyWith({
    List<Block>? blocks,
    bool? isLoading,
    String? error,
    int? selectedDistrictId,
  }) =>
      BlockState(
        blocks: blocks ?? this.blocks,
        isLoading: isLoading ?? this.isLoading,
        error: error,
        selectedDistrictId: selectedDistrictId ?? this.selectedDistrictId,
      );

  List<Block> get filteredBlocks {
    if (selectedDistrictId == null) return blocks;
    return blocks.where((b) => b.districtId == selectedDistrictId).toList();
  }
}

class BlockStoreNotifier extends StateNotifier<BlockState> {
  final HouseApiService _api;
  final StorageService _storage;

  BlockStoreNotifier(this._api, this._storage) : super(const BlockState());

  Future<void> loadBlocks({int? districtId}) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final blocks = await _api.getBlocks(districtId: districtId);
      await _storage.saveBlocks(blocks);
      state = state.copyWith(blocks: blocks, isLoading: false);
    } on Exception catch (e) {
      final cached = _storage.getBlocks();
      state = state.copyWith(
        blocks: cached,
        isLoading: false,
        error: '加载失败: $e',
      );
    }
  }

  void selectDistrict(int? districtId) {
    state = state.copyWith(selectedDistrictId: districtId);
  }
}

final blockStoreProvider =
    StateNotifierProvider<BlockStoreNotifier, BlockState>((ref) {
  return BlockStoreNotifier(
    ref.watch(houseApiServiceProvider),
    ref.watch(storageServiceProvider),
  );
});
