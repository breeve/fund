import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../stores/block_store.dart';
import '../stores/district_store.dart';
import '../theme/app_theme.dart';
import '../widgets/app_layout.dart';

class BlocksPage extends ConsumerStatefulWidget {
  const BlocksPage({super.key});

  @override
  ConsumerState<BlocksPage> createState() => _BlocksPageState();
}

class _BlocksPageState extends ConsumerState<BlocksPage> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(blockStoreProvider.notifier).loadBlocks();
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(blockStoreProvider);
    final districtState = ref.watch(districtStoreProvider);

    return AppLayout(
      title: '板块',
      body: Column(
        children: [
          if (districtState.districts.isNotEmpty)
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  FilterChip(
                    label: const Text('全部'),
                    selected: state.selectedDistrictId == null,
                    onSelected: (_) {
                      ref.read(blockStoreProvider.notifier).selectDistrict(null);
                      ref.read(blockStoreProvider.notifier).loadBlocks();
                    },
                  ),
                  const SizedBox(width: 8),
                  ...districtState.districts.map((d) => Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: FilterChip(
                          label: Text(d.name),
                          selected: state.selectedDistrictId == d.id,
                          onSelected: (_) {
                            ref
                                .read(blockStoreProvider.notifier)
                                .selectDistrict(d.id);
                            ref
                                .read(blockStoreProvider.notifier)
                                .loadBlocks(districtId: d.id);
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
                            ref.read(blockStoreProvider.notifier).loadBlocks();
                          },
                          child: const Text('重试'),
                        ),
                      )
                    : state.filteredBlocks.isEmpty
                        ? const EmptyState(
                            icon: Icons.domain_outlined,
                            message: '暂无板块数据',
                          )
                        : ListView.separated(
                            itemCount: state.filteredBlocks.length,
                            separatorBuilder: (_, __) =>
                                const SizedBox(height: 8),
                            itemBuilder: (context, index) {
                              final block = state.filteredBlocks[index];
                              return Card(
                                child: ListTile(
                                  leading: Container(
                                    width: 40,
                                    height: 40,
                                    decoration: BoxDecoration(
                                      color: AppTheme.categoryBlocks
                                          .withValues(alpha: 0.15),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: const Icon(
                                      Icons.domain,
                                      color: AppTheme.categoryBlocks,
                                    ),
                                  ),
                                  title: Text(block.name),
                                  subtitle: Text(
                                    '${block.communityCount} 个小区',
                                    style: const TextStyle(
                                      color: AppTheme.textSecondary,
                                    ),
                                  ),
                                  trailing:
                                      const Icon(Icons.chevron_right),
                                  onTap: () {
                                    context.go('/life-circles?block=${block.id}');
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
