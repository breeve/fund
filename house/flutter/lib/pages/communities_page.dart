import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../stores/community_store.dart';
import '../theme/app_theme.dart';
import '../widgets/app_layout.dart';

class CommunitiesPage extends ConsumerStatefulWidget {
  const CommunitiesPage({super.key});

  @override
  ConsumerState<CommunitiesPage> createState() => _CommunitiesPageState();
}

class _CommunitiesPageState extends ConsumerState<CommunitiesPage> {
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      final params = GoRouterState.of(context).uri.queryParameters;
      final lifeCircleIdStr = params['lifeCircle'];
      final blockIdStr = params['block'];
      if (lifeCircleIdStr != null || blockIdStr != null) {
        ref.read(communityStoreProvider.notifier).setFilters(
          lifeCircleId: lifeCircleIdStr != null
              ? int.tryParse(lifeCircleIdStr)
              : null,
          blockId: blockIdStr != null ? int.tryParse(blockIdStr) : null,
        );
      }
      ref.read(communityStoreProvider.notifier).loadCommunities();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(communityStoreProvider);

    return AppLayout(
      title: '小区',
      body: Column(
        children: [
          TextField(
            controller: _searchController,
            decoration: InputDecoration(
              hintText: '搜索小区名称...',
              prefixIcon: const Icon(Icons.search),
              suffixIcon: _searchController.text.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.clear),
                      onPressed: () {
                        _searchController.clear();
                        ref.read(communityStoreProvider.notifier).setSearchQuery('');
                      },
                    )
                  : null,
            ),
            onChanged: (value) {
              ref.read(communityStoreProvider.notifier).setSearchQuery(value);
            },
          ),
          const SizedBox(height: 16),
          Expanded(
            child: state.isLoading
                ? const Center(child: CircularProgressIndicator())
                : state.error != null
                    ? EmptyState(
                        icon: Icons.error_outline,
                        message: state.error!,
                        action: ElevatedButton(
                          onPressed: () {
                            ref.read(communityStoreProvider.notifier).loadCommunities();
                          },
                          child: const Text('重试'),
                        ),
                      )
                    : state.filteredCommunities.isEmpty
                        ? const EmptyState(
                            icon: Icons.apartment_outlined,
                            message: '暂无小区数据',
                          )
                        : ListView.separated(
                            itemCount: state.filteredCommunities.length,
                            separatorBuilder: (_, __) =>
                                const SizedBox(height: 8),
                            itemBuilder: (context, index) {
                              final community = state.filteredCommunities[index];
                              return Card(
                                child: ListTile(
                                  leading: Container(
                                    width: 40,
                                    height: 40,
                                    decoration: BoxDecoration(
                                      color: AppTheme.categoryCommunities
                                          .withValues(alpha: 0.15),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: const Icon(
                                      Icons.apartment,
                                      color: AppTheme.categoryCommunities,
                                    ),
                                  ),
                                  title: Text(community.name),
                                  subtitle: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      if (community.address != null)
                                        Text(
                                          community.address!,
                                          style: const TextStyle(
                                            color: AppTheme.textSecondary,
                                            fontSize: 12,
                                          ),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      if (community.dealPrice != null)
                                        Text(
                                          '${community.dealPrice!.toStringAsFixed(0)} 元/㎡',
                                          style: const TextStyle(
                                            color: AppTheme.accent,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                    ],
                                  ),
                                  trailing: const Icon(Icons.chevron_right),
                                  onTap: () {
                                    context.go('/communities/${community.id}');
                                  },
                                ),
                              );
                            },
                          ),
          ),
        ],
      ),
    );
  }
}
