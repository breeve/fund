import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../stores/district_store.dart';
import '../stores/block_store.dart';
import '../stores/life_circle_store.dart';
import '../stores/community_store.dart';
import '../theme/app_theme.dart';
import '../widgets/app_layout.dart';

class OverviewPage extends ConsumerStatefulWidget {
  const OverviewPage({super.key});

  @override
  ConsumerState<OverviewPage> createState() => _OverviewPageState();
}

class _OverviewPageState extends ConsumerState<OverviewPage> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(districtStoreProvider.notifier).loadDistricts();
      ref.read(blockStoreProvider.notifier).loadBlocks();
      ref.read(lifeCircleStoreProvider.notifier).loadLifeCircles();
      ref.read(communityStoreProvider.notifier).loadCommunities();
    });
  }

  @override
  Widget build(BuildContext context) {
    final districtState = ref.watch(districtStoreProvider);
    final blockState = ref.watch(blockStoreProvider);
    final lifeCircleState = ref.watch(lifeCircleStoreProvider);
    final communityState = ref.watch(communityStoreProvider);

    final anyLoading = districtState.isLoading ||
        blockState.isLoading ||
        lifeCircleState.isLoading ||
        communityState.isLoading;

    final anyError = districtState.error != null ||
        blockState.error != null ||
        lifeCircleState.error != null ||
        communityState.error != null;

    return AppLayout(
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const PageHeader(
              title: '房产总览',
              description: '深圳二手房数据分析',
            ),
            if (anyLoading)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 24),
                child: Center(child: CircularProgressIndicator()),
              )
            else if (anyError)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 24),
                child: Center(
                  child: Text(
                    '部分数据加载失败，请检查后端服务',
                    style: TextStyle(color: Colors.orange),
                  ),
                ),
              ),
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 1.5,
              children: [
                MetricCard(
                  icon: Icons.map,
                  title: '行政区',
                  value: districtState.districts.length.toString(),
                  color: AppTheme.categoryDistricts,
                ),
                MetricCard(
                  icon: Icons.domain,
                  title: '板块',
                  value: blockState.blocks.length.toString(),
                  color: AppTheme.categoryBlocks,
                ),
                MetricCard(
                  icon: Icons.circle,
                  title: '生活圈',
                  value: lifeCircleState.lifeCircles.length.toString(),
                  color: AppTheme.categoryLifeCircles,
                ),
                MetricCard(
                  icon: Icons.apartment,
                  title: '小区',
                  value: communityState.communities.length.toString(),
                  color: AppTheme.categoryCommunities,
                ),
              ],
            ),
            const SizedBox(height: 24),
            const SectionHeader(title: '数据来源'),
            const Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '数据同步自深圳贝壳找房、链家等公开房产数据，'
                      '仅供学习研究使用。',
                      style: TextStyle(color: AppTheme.textSecondary),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}