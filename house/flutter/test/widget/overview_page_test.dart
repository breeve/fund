import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:house_app/pages/overview_page.dart';
import 'package:house_app/stores/district_store.dart';
import 'package:house_app/stores/block_store.dart';
import 'package:house_app/stores/life_circle_store.dart';
import 'package:house_app/stores/community_store.dart';
import 'package:house_app/models/district.dart';
import 'package:house_app/models/block.dart';
import 'package:house_app/models/life_circle.dart';
import 'package:house_app/models/community.dart';

// Fake implementations for testing
class FakeDistrictStoreNotifier extends StateNotifier<DistrictState> {
  FakeDistrictStoreNotifier(DistrictState state) : super(state);

  @override
  Future<void> loadDistricts() async {}
}

class FakeBlockStoreNotifier extends StateNotifier<BlockState> {
  FakeBlockStoreNotifier(BlockState state) : super(state);

  @override
  Future<void> loadBlocks() async {}
}

class FakeLifeCircleStoreNotifier extends StateNotifier<LifeCircleState> {
  FakeLifeCircleStoreNotifier(LifeCircleState state) : super(state);

  @override
  Future<void> loadLifeCircles() async {}
}

class FakeCommunityStoreNotifier extends StateNotifier<CommunityState> {
  FakeCommunityStoreNotifier(CommunityState state) : super(state);

  @override
  Future<void> loadCommunities() async {}
}

void main() {
  Widget buildTestWidget({
    DistrictState? districtState,
    BlockState? blockState,
    LifeCircleState? lifeCircleState,
    CommunityState? communityState,
  }) {
    return ProviderScope(
      overrides: [
        districtStoreProvider.overrideWith(
          (ref) => FakeDistrictStoreNotifier(
            districtState ?? const DistrictState(),
          ),
        ),
        blockStoreProvider.overrideWith(
          (ref) => FakeBlockStoreNotifier(
            blockState ?? const BlockState(),
          ),
        ),
        lifeCircleStoreProvider.overrideWith(
          (ref) => FakeLifeCircleStoreNotifier(
            lifeCircleState ?? const LifeCircleState(),
          ),
        ),
        communityStoreProvider.overrideWith(
          (ref) => FakeCommunityStoreNotifier(
            communityState ?? const CommunityState(),
          ),
        ),
      ],
      child: const MaterialApp(home: OverviewPage()),
    );
  }

  testWidgets('displays loading indicator while any store is loading',
      (tester) async {
    await tester.pumpWidget(
      buildTestWidget(
        districtState: const DistrictState(isLoading: true),
        blockState: const BlockState(),
        lifeCircleState: const LifeCircleState(),
        communityState: const CommunityState(),
      ),
    );

    await tester.pump();
    expect(find.byType(CircularProgressIndicator), findsOneWidget);
  });

  testWidgets('displays metric cards with correct counts', (tester) async {
    await tester.pumpWidget(
      buildTestWidget(
        districtState: DistrictState(
          districts: [
            District()..id = 1..name = '南山区',
            District()..id = 2..name = '罗湖区',
            District()..id = 3..name = '福田区',
          ],
        ),
        blockState: BlockState(
          blocks: [
            Block()..id = 1..name = '科技园',
            Block()..id = 2..name = '后海',
          ],
        ),
        lifeCircleState: LifeCircleState(
          lifeCircles: [
            LifeCircle()..id = 1..name = '科技园南',
          ],
        ),
        communityState: CommunityState(
          communities: [
            Community()..id = 1..name = '阳光小区',
            Community()..id = 2..name = '翠湖花园',
            Community()..id = 3..name = '花园公馆',
            Community()..id = 4..name = '湖畔名居',
          ],
        ),
      ),
    );

    await tester.pump();

    // Verify district count
    expect(find.text('3'), findsWidgets); // districts = 3
    // Verify block count
    expect(find.text('2'), findsWidgets); // blocks = 2
    // Verify life circle count
    expect(find.text('1'), findsWidgets); // life circles = 1
    // Verify community count
    expect(find.text('4'), findsWidgets); // communities = 4
  });

  testWidgets('shows zero counts when all stores are empty', (tester) async {
    await tester.pumpWidget(buildTestWidget());

    await tester.pump();

    expect(find.text('0'), findsWidgets);
  });

  testWidgets('displays page header with title and description',
      (tester) async {
    await tester.pumpWidget(buildTestWidget());

    await tester.pump();

    expect(find.text('房产总览'), findsOneWidget);
    expect(find.text('深圳二手房数据分析'), findsOneWidget);
  });
}