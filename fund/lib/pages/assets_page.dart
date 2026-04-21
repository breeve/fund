import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../stores/asset_store.dart';
import '../models/asset.dart';
import '../widgets/app_layout.dart';
import '../theme/app_theme.dart';

class AssetsPage extends ConsumerStatefulWidget {
  const AssetsPage({super.key});

  @override
  ConsumerState<AssetsPage> createState() => _AssetsPageState();
}

class _AssetsPageState extends ConsumerState<AssetsPage> {
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
    final filteredAssets = assetState.filteredAssets;

    return AppLayout(
      title: '资产列表',
      body: Column(
        children: [
          _buildSearchAndFilter(assetState),
          const SizedBox(height: 16),
          Expanded(
            child: assetState.isLoading
                ? const Center(child: CircularProgressIndicator())
                : filteredAssets.isEmpty
                    ? EmptyState(
                        icon: Icons.account_balance_wallet_outlined,
                        message: '暂无资产，点击右下角添加',
                        action: ElevatedButton.icon(
                          onPressed: () => context.go('/assets/new'),
                          icon: const Icon(Icons.add),
                          label: const Text('添加资产'),
                        ),
                      )
                    : _buildAssetsList(filteredAssets),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.go('/assets/new'),
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildSearchAndFilter(AssetState assetState) {
    return Column(
      children: [
        TextField(
          decoration: InputDecoration(
            hintText: '搜索资产...',
            prefixIcon: const Icon(Icons.search),
            suffixIcon: assetState.searchQuery?.isNotEmpty == true
                ? IconButton(
                    icon: const Icon(Icons.clear),
                    onPressed: () {
                      ref.read(assetStoreProvider.notifier).setSearchQuery(null);
                    },
                  )
                : null,
          ),
          onChanged: (value) {
            ref.read(assetStoreProvider.notifier).setSearchQuery(value);
          },
        ),
        const SizedBox(height: 12),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              _buildFilterChip(null, '全部', assetState.filterCategory),
              ...AssetCategory.values.map(
                (cat) => _buildFilterChip(
                  cat,
                  AppTheme.categoryNames[cat.name] ?? cat.name,
                  assetState.filterCategory,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildFilterChip(AssetCategory? category, String label, AssetCategory? currentFilter) {
    final isSelected = category == currentFilter;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text(label),
        selected: isSelected,
        onSelected: (_) {
          ref.read(assetStoreProvider.notifier).setFilter(category);
        },
        selectedColor: AppTheme.primary.withValues(alpha: 0.2),
        checkmarkColor: AppTheme.primary,
      ),
    );
  }

  Widget _buildAssetsList(List<BaseAsset> assets) {
    return ListView.separated(
      itemCount: assets.length,
      separatorBuilder: (_, __) => const SizedBox(height: 8),
      itemBuilder: (context, index) {
        final asset = assets[index];
        return _buildAssetCard(asset);
      },
    );
  }

  Widget _buildAssetCard(BaseAsset asset) {
    final value = _getAssetValue(asset);
    final valueText = _getAssetValueText(asset);

    return Card(
      child: InkWell(
        onTap: () => context.go('/assets/${asset.id}'),
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: (AppTheme.categoryColors[asset.category.name] ?? AppTheme.primary)
                      .withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Center(
                  child: Text(
                    _getCategoryIcon(asset.category),
                    style: const TextStyle(fontSize: 24),
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
                        fontWeight: FontWeight.w600,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${AppTheme.categoryNames[asset.category.name]} · ${asset.subType}',
                      style: TextStyle(
                        fontSize: 13,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    valueText,
                    style: const TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 16,
                    ),
                  ),
                  if (value != null)
                    Text(
                      _getReturnRateText(asset),
                      style: TextStyle(
                        fontSize: 12,
                        color: _getReturnColor(asset),
                      ),
                    ),
                ],
              ),
              const SizedBox(width: 8),
              Icon(
                Icons.chevron_right,
                color: AppTheme.textSecondary,
              ),
            ],
          ),
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

  double? _getAssetValue(BaseAsset asset) {
    if (asset is PublicFundAsset) return asset.total;
    if (asset is PrivateFundAsset) return asset.total;
    if (asset is StrategyAsset) return asset.total;
    if (asset is FixedTermAsset) return asset.investmentAmount;
    if (asset is LiquidAsset) return asset.total;
    if (asset is DerivativeAsset) return asset.total;
    return null;
  }

  String _getAssetValueText(BaseAsset asset) {
    final value = _getAssetValue(asset);
    if (value == null) return '-';
    return '${(value / 10000).toStringAsFixed(2)}万';
  }

  String _getReturnRateText(BaseAsset asset) {
    if (asset is PublicFundAsset) {
      return '${asset.returnRate >= 0 ? '+' : ''}${asset.returnRate.toStringAsFixed(2)}%';
    }
    if (asset is PrivateFundAsset) {
      return '${asset.returnRate >= 0 ? '+' : ''}${asset.returnRate.toStringAsFixed(2)}%';
    }
    if (asset is StrategyAsset) {
      return '${asset.returnRate >= 0 ? '+' : ''}${asset.returnRate.toStringAsFixed(2)}%';
    }
    if (asset is DerivativeAsset) {
      return '${asset.returnRate >= 0 ? '+' : ''}${asset.returnRate.toStringAsFixed(2)}%';
    }
    return '';
  }

  Color _getReturnColor(BaseAsset asset) {
    double? returnRate;
    if (asset is PublicFundAsset) returnRate = asset.returnRate;
    if (asset is PrivateFundAsset) returnRate = asset.returnRate;
    if (asset is StrategyAsset) returnRate = asset.returnRate;
    if (asset is DerivativeAsset) returnRate = asset.returnRate;

    if (returnRate == null) return AppTheme.textSecondary;
    return returnRate >= 0 ? AppTheme.success : AppTheme.error;
  }
}
