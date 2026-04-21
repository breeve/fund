import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/district.dart';
import '../services/house_api.dart';
import '../services/storage.dart';

// Re-export shared providers
export 'house_api_service_provider.dart';
export 'storage_service_provider.dart';

class DistrictState {
  final List<District> districts;
  final bool isLoading;
  final String? error;

  const DistrictState({
    this.districts = const [],
    this.isLoading = false,
    this.error,
  });

  DistrictState copyWith({
    List<District>? districts,
    bool? isLoading,
    String? error,
  }) =>
      DistrictState(
        districts: districts ?? this.districts,
        isLoading: isLoading ?? this.isLoading,
        error: error,
      );
}

class DistrictStoreNotifier extends StateNotifier<DistrictState> {
  final HouseApiService _api;
  final StorageService _storage;

  DistrictStoreNotifier(this._api, this._storage)
      : super(const DistrictState());

  Future<void> loadDistricts() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final districts = await _api.getDistricts();
      await _storage.saveDistricts(districts);
      state = state.copyWith(districts: districts, isLoading: false);
    } on Exception catch (e) {
      final cached = _storage.getDistricts();
      state = state.copyWith(
        districts: cached,
        isLoading: false,
        error: '加载失败: $e',
      );
    }
  }
}

// Providers
final districtStoreProvider =
    StateNotifierProvider<DistrictStoreNotifier, DistrictState>((ref) {
  return DistrictStoreNotifier(
    ref.watch(houseApiServiceProvider),
    ref.watch(storageServiceProvider),
  );
});
