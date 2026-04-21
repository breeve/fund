import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../stores/district_store.dart';
import '../theme/app_theme.dart';
import '../widgets/app_layout.dart';

class DistrictsPage extends ConsumerStatefulWidget {
  const DistrictsPage({super.key});

  @override
  ConsumerState<DistrictsPage> createState() => _DistrictsPageState();
}

class _DistrictsPageState extends ConsumerState<DistrictsPage> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(districtStoreProvider.notifier).loadDistricts();
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(districtStoreProvider);

    return AppLayout(
      title: '行政区',
      body: state.isLoading
          ? const Center(child: CircularProgressIndicator())
          : state.error != null
              ? EmptyState(
                  icon: Icons.error_outline,
                  message: state.error!,
                  action: ElevatedButton(
                    onPressed: () {
                      ref.read(districtStoreProvider.notifier).loadDistricts();
                    },
                    child: const Text('重试'),
                  ),
                )
              : state.districts.isEmpty
                  ? const EmptyState(
                      icon: Icons.map_outlined,
                      message: '暂无行政区数据',
                    )
                  : ListView.separated(
                      itemCount: state.districts.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 8),
                      itemBuilder: (context, index) {
                        final district = state.districts[index];
                        return Card(
                          child: ListTile(
                            leading: Container(
                              width: 40,
                              height: 40,
                              decoration: BoxDecoration(
                                color: AppTheme.categoryDistricts
                                    .withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Icon(
                                Icons.map,
                                color: AppTheme.categoryDistricts,
                              ),
                            ),
                            title: Text(district.name),
                            subtitle: Text(
                              '${district.blockCount} 个板块',
                              style: const TextStyle(
                                color: AppTheme.textSecondary,
                              ),
                            ),
                            trailing: const Icon(Icons.chevron_right),
                          ),
                        );
                      },
                    ),
    );
  }
}
