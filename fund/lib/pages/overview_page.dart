import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../stores/asset_store.dart';
import '../models/asset.dart';
import '../widgets/app_layout.dart';
import '../widgets/metric_card.dart';
import '../widgets/category_pie_chart.dart';
import '../widgets/net_worth_trend_chart.dart';
import '../theme/app_theme.dart';

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
      ref.read(assetStoreProvider.notifier).loadAssets();
    });
  }

  @override
  Widget build(BuildContext context) {
    final assetState = ref.watch(assetStoreProvider);
    final totalAssets = assetState.totalAssets;
    final breakdown = assetState.categoryBreakdown;

    return AppLayout(
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const PageHeader(
              title: '资产总览',
              description: '查看您的家庭资产整体状况',
            ),
            _buildMetricsRow(totalAssets),
            const SizedBox(height: 24),
            _buildChartsRow(breakdown),
            const SizedBox(height: 24),
            _buildCategoryTable(assetState),
            const SizedBox(height: 24),
            _buildQuickActions(),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricsRow(double totalAssets) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final crossAxisCount = constraints.maxWidth > 600 ? 2 : 1;
        return GridView.count(
          crossAxisCount: crossAxisCount,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 16,
          crossAxisSpacing: 16,
          childAspectRatio: crossAxisCount == 2 ? 2.0 : 2.5,
          children: [
            MetricCard(
              title: '总资产',
              value: '${(totalAssets / 10000).toStringAsFixed(2)}万',
              icon: '🏦',
              color: 'primary',
            ),
            MetricCard(
              title: '净资产',
              value: '${(totalAssets / 10000).toStringAsFixed(2)}万',
              icon: '💎',
              color: 'success',
            ),
          ],
        );
      },
    );
  }

  Widget _buildChartsRow(Map<AssetCategory, double> breakdown) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth > 600) {
          return SizedBox(
            height: 250,
            child: Row(
              children: [
                Expanded(
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: CategoryPieChart(
                        data: breakdown,
                        title: '资产构成',
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: NetWorthTrendChart(
                        data: _getMockTrendData(),
                        dateRange: '3M',
                      ),
                    ),
                  ),
                ),
              ],
            ),
          );
        }
        return Column(
          children: [
            SizedBox(
              height: 250,
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: CategoryPieChart(
                    data: breakdown,
                    title: '资产构成',
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 250,
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: NetWorthTrendChart(
                    data: _getMockTrendData(),
                    dateRange: '3M',
                  ),
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildCategoryTable(AssetState assetState) {
    final breakdown = assetState.categoryBreakdown;
    final filteredCategories = breakdown.entries.where((e) => e.value > 0).toList();

    if (filteredCategories.isEmpty) {
      return const SizedBox();
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SectionHeader(
              title: '资产分类明细',
              action: TextButton(
                onPressed: () => context.go('/assets'),
                child: const Text('查看全部'),
              ),
            ),
            const SizedBox(height: 8),
            Table(
              columnWidths: const {
                0: FlexColumnWidth(2),
                1: FlexColumnWidth(1.5),
                2: FlexColumnWidth(1),
                3: FlexColumnWidth(1),
              },
              children: [
                const TableRow(
                  children: [
                    Text('类别', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                    Text('金额', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                    Text('占比', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                    Text('数量', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                  ],
                ),
                ...filteredCategories.map((entry) {
                  final count = assetState.assets.where((a) => a.category == entry.key).length;
                  final percentage = assetState.totalAssets > 0
                      ? (entry.value / assetState.totalAssets * 100)
                      : 0.0;
                  return TableRow(
                    children: [
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        child: Row(
                          children: [
                            Container(
                              width: 10,
                              height: 10,
                              decoration: BoxDecoration(
                                color: AppTheme.categoryColors[entry.key.name],
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(AppTheme.categoryNames[entry.key.name] ?? entry.key.name),
                          ],
                        ),
                      ),
                      Text('${(entry.value / 10000).toStringAsFixed(2)}万'),
                      Text('${percentage.toStringAsFixed(1)}%'),
                      Text('$count'),
                    ],
                  );
                }),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActions() {
    return LayoutBuilder(
      builder: (context, constraints) {
        final crossAxisCount = constraints.maxWidth > 400 ? 3 : 2;
        return GridView.count(
          crossAxisCount: crossAxisCount,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          childAspectRatio: 1.2,
          children: [
            _buildActionCard(
              icon: '➕',
              label: '添加资产',
              onTap: () => context.go('/assets/new'),
            ),
            _buildActionCard(
              icon: '🔍',
              label: '基金诊断',
              onTap: () => context.go('/fund'),
            ),
            _buildActionCard(
              icon: '⚙️',
              label: '设置',
              onTap: () => context.go('/settings'),
            ),
          ],
        );
      },
    );
  }

  Widget _buildActionCard({
    required String icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(icon, style: const TextStyle(fontSize: 28)),
              const SizedBox(height: 8),
              Text(
                label,
                style: const TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 14,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  List<TrendPoint> _getMockTrendData() {
    return [];
  }
}
