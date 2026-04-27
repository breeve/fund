import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:house_app/stores/community_store.dart';
import 'package:house_app/models/community.dart';
import 'package:house_app/services/house_api.dart';
import 'package:house_app/services/storage.dart';

class FakeHouseApiService implements HouseApiService {
  List<Community> fakeCommunities;
  Exception? error;

  FakeHouseApiService({this.fakeCommunities = const [], this.error});

  @override
  Future<List<Community>> getCommunities({
    int? blockId,
    int? lifeCircleId,
    double? priceMin,
    double? priceMax,
  }) async {
    if (error != null) throw error!;
    var result = fakeCommunities;
    if (blockId != null) {
      result = result.where((c) => c.blockId == blockId).toList();
    }
    if (lifeCircleId != null) {
      result = result.where((c) => c.lifeCircleId == lifeCircleId).toList();
    }
    if (priceMin != null) {
      result = result.where((c) => (c.dealPrice ?? 0) >= priceMin).toList();
    }
    if (priceMax != null) {
      result = result.where((c) => (c.dealPrice ?? double.infinity) <= priceMax).toList();
    }
    return result;
  }
}

class FakeStorageService implements StorageService {
  @override
  List<Community> getCommunities() => [];

  @override
  Future<void> saveCommunities(List<Community> communities) async {}
}

void main() {
  group('CommunityStoreNotifier', () {
    test('loadCommunities populates state with fetched data', () async {
      final container = ProviderContainer(
        overrides: [
          communityStoreProvider.overrideWith(
            () => CommunityStoreNotifier(
              FakeHouseApiService(
                fakeCommunities: [
                  Community()
                    ..id = 1
                    ..name = '阳光小区'
                    ..dealPrice = 50000,
                ],
              ),
              FakeStorageService(),
            ),
          ),
        ],
      );

      addTearDown(container.dispose);

      await container.read(communityStoreProvider.notifier).loadCommunities();

      final state = container.read(communityStoreProvider);
      expect(state.communities, hasLength(1));
      expect(state.communities[0].name, '阳光小区');
      expect(state.isLoading, false);
      expect(state.error, isNull);
    });

    test('loadCommunities falls back to cached data on error', () async {
      final container = ProviderContainer(
        overrides: [
          communityStoreProvider.overrideWith(
            () => CommunityStoreNotifier(
              FakeHouseApiService(error: Exception('network error')),
              _StubStorageService([
                Community()
                  ..id = 2
                  ..name = '缓存小区',
              ]),
            ),
          ),
        ],
      );

      addTearDown(container.dispose);

      await container.read(communityStoreProvider.notifier).loadCommunities();

      final state = container.read(communityStoreProvider);
      expect(state.communities, hasLength(1));
      expect(state.communities[0].name, '缓存小区');
      expect(state.error, isNotNull);
      expect(state.error, contains('network error'));
    });

    test('setFilters updates filter state', () async {
      final container = ProviderContainer(
        overrides: [
          communityStoreProvider.overrideWith(
            () => CommunityStoreNotifier(
              FakeHouseApiService(),
              FakeStorageService(),
            ),
          ),
        ],
      );

      addTearDown(container.dispose);

      container.read(communityStoreProvider.notifier).setFilters(
            lifeCircleId: 10,
            priceMin: 30000,
          );

      final state = container.read(communityStoreProvider);
      expect(state.selectedLifeCircleId, 10);
      expect(state.priceMin, 30000);
    });

    test('clearFilters resets all filter state', () async {
      final container = ProviderContainer(
        overrides: [
          communityStoreProvider.overrideWith(
            () => CommunityStoreNotifier(
              FakeHouseApiService(),
              FakeStorageService(),
            ),
          ),
        ],
      );

      addTearDown(container.dispose);

      container.read(communityStoreProvider.notifier).setFilters(
            blockId: 5,
            priceMin: 20000,
            priceMax: 80000,
          );
      container.read(communityStoreProvider.notifier).clearFilters();

      final state = container.read(communityStoreProvider);
      expect(state.selectedBlockId, isNull);
      expect(state.selectedLifeCircleId, isNull);
      expect(state.priceMin, isNull);
      expect(state.priceMax, isNull);
      expect(state.searchQuery, isEmpty);
    });

    test('setSearchQuery updates search query', () async {
      final container = ProviderContainer(
        overrides: [
          communityStoreProvider.overrideWith(
            () => CommunityStoreNotifier(
              FakeHouseApiService(),
              FakeStorageService(),
            ),
          ),
        ],
      );

      addTearDown(container.dispose);

      container.read(communityStoreProvider.notifier).setSearchQuery('花园');

      final state = container.read(communityStoreProvider);
      expect(state.searchQuery, '花园');
    });
  });

  group('CommunityState.filteredCommunities', () {
    test('filters by blockId', () {
      final state = CommunityState(
        communities: [
          Community()..id = 1..blockId = 5..name = 'A',
          Community()..id = 2..blockId = 6..name = 'B',
          Community()..id = 3..blockId = 5..name = 'C',
        ],
        selectedBlockId: 5,
      );

      expect(state.filteredCommunities, hasLength(2));
      expect(state.filteredCommunities.map((c) => c.id), containsAll([1, 3]));
    });

    test('filters by price range', () {
      final state = CommunityState(
        communities: [
          Community()..id = 1..dealPrice = 30000..name = '低价',
          Community()..id = 2..dealPrice = 70000..name = '高价',
          Community()..id = 3..dealPrice = 50000..name = '中价',
        ],
        priceMin: 40000,
        priceMax: 60000,
      );

      expect(state.filteredCommunities, hasLength(1));
      expect(state.filteredCommunities[0].name, '中价');
    });

    test('filters by searchQuery case-insensitively', () {
      final state = CommunityState(
        communities: [
          Community()..id = 1..name = '阳光花园',
          Community()..id = 2..name = '翠湖公馆',
          Community()..id = 3..name = '花园小区',
          Community()..id = 4..name = '阳光城',
        ],
        searchQuery: '阳光',
      );

      expect(state.filteredCommunities, hasLength(2));
      expect(state.filteredCommunities.map((c) => c.name),
          containsAll(['阳光花园', '阳光城']));
    });
  });
}

// Helper stub that returns provided list for getCommunities
class _StubStorageService implements StorageService {
  final List<Community> _data;
  _StubStorageService(this._data);

  @override
  List<Community> getCommunities() => _data;

  @override
  Future<void> saveCommunities(List<Community> communities) async {}
}