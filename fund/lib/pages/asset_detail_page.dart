import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../stores/asset_store.dart';
import '../models/asset.dart';
import '../widgets/app_layout.dart';
import '../theme/app_theme.dart';

class AssetDetailPage extends ConsumerWidget {
  const AssetDetailPage({super.key, required this.assetId});

  final String assetId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final assetState = ref.watch(assetStoreProvider);
    final asset = assetState.assets.cast<BaseAsset?>().firstWhere(
          (a) => a?.id == assetId,
          orElse: () => null,
        );

    if (asset == null) {
      return AppLayout(
        title: '资产详情',
        body: const EmptyState(
          icon: Icons.error_outline,
          message: '资产不存在',
        ),
      );
    }

    return AppLayout(
      title: '资产详情',
      actions: [
        IconButton(
          icon: const Icon(Icons.edit),
          onPressed: () => context.go('/assets/$assetId/edit'),
        ),
        IconButton(
          icon: const Icon(Icons.delete),
          onPressed: () => _showDeleteDialog(context, ref, asset),
        ),
      ],
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeader(asset),
            const SizedBox(height: 24),
            _buildValueSection(asset),
            const SizedBox(height: 24),
            _buildDetailsSection(asset),
            if (asset is PublicFundAsset && asset.topHoldings?.isNotEmpty == true) ...[
              const SizedBox(height: 24),
              _buildTopHoldings(asset.topHoldings!),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(BaseAsset asset) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: (AppTheme.categoryColors[asset.category.name] ?? AppTheme.primary)
                    .withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Center(
                child: Text(
                  _getCategoryIcon(asset.category),
                  style: const TextStyle(fontSize: 32),
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    asset.name,
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${AppTheme.categoryNames[asset.category.name]} · ${asset.subType}',
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

  Widget _buildValueSection(BaseAsset asset) {
    double? total;
    double? profit;
    double? returnRate;
    double? cost;

    if (asset is PublicFundAsset) {
      total = asset.total;
      profit = asset.profit;
      cost = asset.cost;
      returnRate = asset.returnRate;
    } else if (asset is PrivateFundAsset) {
      total = asset.total;
      profit = asset.profit;
      cost = asset.cost;
      returnRate = asset.returnRate;
    } else if (asset is StrategyAsset) {
      total = asset.total;
      profit = asset.profit;
      cost = asset.cost;
      returnRate = asset.returnRate;
    } else if (asset is FixedTermAsset) {
      total = asset.investmentAmount;
    } else if (asset is LiquidAsset) {
      total = asset.total;
    } else if (asset is DerivativeAsset) {
      total = asset.total;
      profit = asset.profit;
      cost = asset.cost;
      returnRate = asset.returnRate;
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '价值信息',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: _buildValueItem(
                    '总额度',
                    total != null ? '${(total / 10000).toStringAsFixed(2)}万' : '-',
                  ),
                ),
                if (cost != null)
                  Expanded(
                    child: _buildValueItem(
                      '持仓成本',
                      '${(cost / 10000).toStringAsFixed(2)}万',
                    ),
                  ),
              ],
            ),
            if (profit != null) ...[
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: _buildValueItem(
                      '持有收益',
                      '${profit >= 0 ? '+' : ''}${(profit / 10000).toStringAsFixed(2)}万',
                      valueColor: profit >= 0 ? AppTheme.success : AppTheme.error,
                    ),
                  ),
                  if (returnRate != null)
                    Expanded(
                      child: _buildValueItem(
                        '收益率',
                        '${returnRate >= 0 ? '+' : ''}${returnRate.toStringAsFixed(2)}%',
                        valueColor: returnRate >= 0 ? AppTheme.success : AppTheme.error,
                      ),
                    ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildValueItem(String label, String value, {Color? valueColor}) {
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
            color: valueColor ?? AppTheme.textPrimary,
          ),
        ),
      ],
    );
  }

  Widget _buildDetailsSection(BaseAsset asset) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '详细信息',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 16),
            _buildDetailRow('标签', asset.tags.isEmpty ? '-' : asset.tags.join(', ')),
            _buildDetailRow('备注', asset.notes.isEmpty ? '-' : asset.notes),
            _buildDetailRow('录入时间', asset.entryTime.substring(0, 10)),
            _buildDetailRow('创建时间', asset.createdAt.substring(0, 10)),
            _buildDetailRow('更新时间', asset.updatedAt.substring(0, 10)),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 80,
            child: Text(
              label,
              style: TextStyle(
                fontSize: 13,
                color: AppTheme.textSecondary,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontSize: 13),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTopHoldings(List<String> holdings) {
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
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: holdings.map((holding) {
                return Chip(
                  label: Text(holding),
                  backgroundColor: AppTheme.bgLight,
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }

  String _getCategoryIcon(AssetCategory category) {
    switch (category) {
      case AssetCategory.fund:
        return '📈';
      case AssetCategory.privateFund:
        return '🏛️';
      case AssetCategory.strategy:
        return '🎯';
      case AssetCategory.fixed:
        return '📅';
      case AssetCategory.liquid:
        return '💰';
      case AssetCategory.derivative:
        return '🪙';
      case AssetCategory.protection:
        return '🛡️';
    }
  }

  void _showDeleteDialog(BuildContext context, WidgetRef ref, BaseAsset asset) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('删除资产'),
        content: Text('确定要删除 "${asset.name}" 吗？此操作不可撤销。'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('取消'),
          ),
          TextButton(
            onPressed: () {
              ref.read(assetStoreProvider.notifier).deleteAsset(asset.id);
              Navigator.of(ctx).pop();
              context.go('/assets');
            },
            style: TextButton.styleFrom(foregroundColor: AppTheme.error),
            child: const Text('删除'),
          ),
        ],
      ),
    );
  }
}
