import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../theme/app_theme.dart';
import '../widgets/app_layout.dart';

class OverviewPage extends ConsumerWidget {
  const OverviewPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return AppLayout(
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const PageHeader(
              title: '房产总览',
              description: '深圳二手房数据分析',
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
                  value: '--',
                  color: AppTheme.categoryDistricts,
                ),
                MetricCard(
                  icon: Icons.domain,
                  title: '板块',
                  value: '--',
                  color: AppTheme.categoryBlocks,
                ),
                MetricCard(
                  icon: Icons.circle,
                  title: '生活圈',
                  value: '--',
                  color: AppTheme.categoryLifeCircles,
                ),
                MetricCard(
                  icon: Icons.apartment,
                  title: '小区',
                  value: '--',
                  color: AppTheme.categoryCommunities,
                ),
              ],
            ),
            const SizedBox(height: 24),
            const SectionHeader(title: '暂无数据'),
            const EmptyState(
              icon: Icons.home_work_outlined,
              message: '等待后端服务连接...',
            ),
          ],
        ),
      ),
    );
  }
}
