import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../models/fund.dart';
import '../stores/fund_store.dart';
import '../widgets/app_layout.dart';
import '../theme/app_theme.dart';

class FundDiagnosisPage extends ConsumerStatefulWidget {
  const FundDiagnosisPage({super.key, required this.fundCode});

  final String fundCode;

  @override
  ConsumerState<FundDiagnosisPage> createState() => _FundDiagnosisPageState();
}

class _FundDiagnosisPageState extends ConsumerState<FundDiagnosisPage> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(fundStoreProvider.notifier).selectFund(widget.fundCode);
    });
  }

  @override
  Widget build(BuildContext context) {
    final fundState = ref.watch(fundStoreProvider);
    final fund = fundState.selectedFund;
    final navHistory = fundState.navHistory;
    final topHoldings = fundState.topHoldings;
    final isLoading = fundState.isLoading;

    return AppLayout(
      title: '基金诊断',
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : fund == null
              ? EmptyState(
                  icon: Icons.error_outline,
                  message: fundState.error ?? '无法获取基金信息',
                  action: ElevatedButton(
                    onPressed: () => context.go('/fund'),
                    child: const Text('返回搜索'),
                  ),
                )
              : SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildFundHeader(fund),
                      const SizedBox(height: 24),
                      _buildRiskMetrics(),
                      const SizedBox(height: 24),
                      if (topHoldings.isNotEmpty) ...[
                        _buildTopHoldings(topHoldings),
                        const SizedBox(height: 24),
                      ],
                      if (navHistory.isNotEmpty) ...[
                        _buildNavHistory(navHistory),
                        const SizedBox(height: 24),
                      ],
                    ],
                  ),
                ),
    );
  }

  Widget _buildFundHeader(FundInfo fund) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: AppTheme.primary.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Center(
                child: Text('📈', style: TextStyle(fontSize: 32)),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    fund.name,
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${fund.code} · ${fund.type}',
                    style: TextStyle(
                      fontSize: 14,
                      color: AppTheme.textSecondary,
                    ),
                  ),
                  Text(
                    fund.company,
                    style: TextStyle(
                      fontSize: 14,
                      color: AppTheme.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRiskMetrics() {
    final notifier = ref.read(fundStoreProvider.notifier);
    final metrics = notifier.calculateRiskMetrics();
    final rating = notifier.calculateRating(metrics);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  '风险指标',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                _buildRatingStars(rating),
              ],
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(
                  child: _buildMetricItem(
                    '波动率',
                    '${metrics.volatility.toStringAsFixed(2)}%',
                    metrics.volatility < 15
                        ? AppTheme.success
                        : metrics.volatility < 25
                            ? AppTheme.warning
                            : AppTheme.error,
                  ),
                ),
                Expanded(
                  child: _buildMetricItem(
                    '最大回撤',
                    '${metrics.maxDrawdown.toStringAsFixed(2)}%',
                    metrics.maxDrawdown < 10
                        ? AppTheme.success
                        : metrics.maxDrawdown < 20
                            ? AppTheme.warning
                            : AppTheme.error,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildMetricItem(
                    '夏普比率',
                    metrics.sharpeRatio.toStringAsFixed(2),
                    metrics.sharpeRatio > 1
                        ? AppTheme.success
                        : metrics.sharpeRatio > 0.5
                            ? AppTheme.warning
                            : AppTheme.error,
                  ),
                ),
                Expanded(
                  child: _buildMetricItem(
                    '大盘相关性',
                    metrics.correlationToMarket.toStringAsFixed(2),
                    AppTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRatingStars(int rating) {
    return Row(
      children: List.generate(5, (index) {
        return Icon(
          index < rating ? Icons.star : Icons.star_border,
          color: AppTheme.warning,
          size: 20,
        );
      }),
    );
  }

  Widget _buildMetricItem(String label, String value, Color valueColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: AppTheme.textSecondary,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: valueColor,
          ),
        ),
      ],
    );
  }

  Widget _buildTopHoldings(List<FundHolding> holdings) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '重仓股票',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 16),
            ...holdings.take(10).map((holding) {
              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 6),
                child: Row(
                  children: [
                    Container(
                      width: 24,
                      height: 24,
                      decoration: BoxDecoration(
                        color: AppTheme.primary.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Center(
                        child: Text(
                          '${holding.rank}',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.primary,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            holding.name,
                            style: const TextStyle(
                              fontWeight: FontWeight.w500,
                              fontSize: 14,
                            ),
                          ),
                          if (holding.industry != null)
                            Text(
                              holding.industry!,
                              style: TextStyle(
                                fontSize: 12,
                                color: AppTheme.textSecondary,
                              ),
                            ),
                        ],
                      ),
                    ),
                    Text(
                      '${holding.proportion.toStringAsFixed(2)}%',
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              );
            }),
          ],
        ),
      ),
    );
  }

  Widget _buildNavHistory(List<FundNAV> navHistory) {
    final latestNav = navHistory.isNotEmpty ? navHistory.last : null;
    final firstNav = navHistory.isNotEmpty ? navHistory.first : null;

    double? changePct;
    if (latestNav != null && firstNav != null && firstNav.nav != 0) {
      changePct = ((latestNav.nav - firstNav.nav) / firstNav.nav) * 100;
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  '净值走势',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                if (changePct != null)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: changePct >= 0
                          ? AppTheme.success.withValues(alpha: 0.1)
                          : AppTheme.error.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      '${changePct >= 0 ? '+' : ''}${changePct.toStringAsFixed(2)}%',
                      style: TextStyle(
                        color: changePct >= 0 ? AppTheme.success : AppTheme.error,
                        fontWeight: FontWeight.w600,
                        fontSize: 13,
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 16),
            if (latestNav != null) ...[
              Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    latestNav.nav.toStringAsFixed(4),
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(width: 8),
                  if (latestNav.accNav != null)
                    Text(
                      '累计净值: ${latestNav.accNav!.toStringAsFixed(4)}',
                      style: TextStyle(
                        fontSize: 14,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 4),
              Text(
                '日期: ${latestNav.date}',
                style: TextStyle(
                  fontSize: 12,
                  color: AppTheme.textSecondary,
                ),
              ),
            ],
            const SizedBox(height: 16),
            const Divider(),
            const SizedBox(height: 8),
            Text(
              '历史净值 (共 ${navHistory.length} 条)',
              style: TextStyle(
                fontSize: 13,
                color: AppTheme.textSecondary,
              ),
            ),
            const SizedBox(height: 8),
            SizedBox(
              height: 150,
              child: ListView.separated(
                itemCount: navHistory.length.clamp(0, 10),
                separatorBuilder: (_, __) => const Divider(height: 1),
                itemBuilder: (context, index) {
                  final nav = navHistory[navHistory.length - 1 - index];
                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 4),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          nav.date,
                          style: TextStyle(
                            fontSize: 13,
                            color: AppTheme.textSecondary,
                          ),
                        ),
                        Text(
                          nav.nav.toStringAsFixed(4),
                          style: const TextStyle(
                            fontWeight: FontWeight.w500,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
