import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../stores/life_circle_store.dart';
import '../stores/block_store.dart';
import '../theme/app_theme.dart';
import '../widgets/app_layout.dart';

class LifeCirclesPage extends ConsumerStatefulWidget {
  const LifeCirclesPage({super.key});

  @override
  ConsumerState<LifeCirclesPage> createState() => _LifeCirclesPageState();
}

class _LifeCirclesPageState extends ConsumerState<LifeCirclesPage> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      final params = GoRouterState.of(context).uri.queryParameters;
      final blockIdStr = params['block'];
      if (blockIdStr != null) {
        final blockId = int.tryParse(blockIdStr);
        if (blockId != null) {
          ref.read(lifeCircleStoreProvider.notifier).selectBlock(blockId);
          ref.read(lifeCircleStoreProvider.notifier).loadLifeCircles(blockId: blockId);
          return;
        }
      }
      ref.read(lifeCircleStoreProvider.notifier).loadLifeCircles();
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(lifeCircleStoreProvider);
    final blockState = ref.watch(blockStoreProvider);

    return AppLayout(
      title: '生活圈',
      body: Column(
        children: [
          if (blockState.blocks.isNotEmpty)
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  FilterChip(
                    label: const Text('全部'),
                    selected: state.selectedBlockId == null,
                    onSelected: (_) {
                      ref.read(lifeCircleStoreProvider.notifier).selectBlock(null);
                      ref.read(lifeCircleStoreProvider.notifier).loadLifeCircles();
                    },
                  ),
                  const SizedBox(width: 8),
                  ...blockState.blocks.map((b) => Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: FilterChip(
                          label: Text(b.name),
                          selected: state.selectedBlockId == b.id,
                          onSelected: (_) {
                            ref.read(lifeCircleStoreProvider.notifier).selectBlock(b.id);
                            ref.read(lifeCircleStoreProvider.notifier).loadLifeCircles(blockId: b.id);
                          },
                        ),
                      )),
                ],
              ),
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
                            ref.read(lifeCircleStoreProvider.notifier).loadLifeCircles();
                          },
                          child: const Text('重试'),
                        ),
                      )
                    : state.filteredLifeCircles.isEmpty
                        ? const EmptyState(
                            icon: Icons.circle_outlined,
                            message: '暂无生活圈数据',
                          )
                        : ListView.separated(
                            itemCount: state.filteredLifeCircles.length,
                            separatorBuilder: (_, __) =>
                                const SizedBox(height: 8),
                            itemBuilder: (context, index) {
                              final circle = state.filteredLifeCircles[index];
                              return Card(
                                child: ListTile(
                                  leading: Container(
                                    width: 40,
                                    height: 40,
                                    decoration: BoxDecoration(
                                      color: AppTheme.categoryLifeCircles
                                          .withValues(alpha: 0.15),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: const Icon(
                                      Icons.circle,
                                      color: AppTheme.categoryLifeCircles,
                                    ),
                                  ),
                                  title: Text(circle.name),
                                  subtitle: Text(
                                    '${circle.communityCount} 个小区',
                                    style: const TextStyle(
                                      color: AppTheme.textSecondary,
                                    ),
                                  ),
                                  trailing:
                                      const Icon(Icons.chevron_right),
                                  onTap: () {
                                    context.go('/communities?lifeCircle=${circle.id}');
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
