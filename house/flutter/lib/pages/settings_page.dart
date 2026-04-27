import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/storage.dart';
import '../stores/storage_service_provider.dart';
import '../stores/house_api_service_provider.dart';
import '../widgets/app_layout.dart';

const _apiBaseUrlKey = 'api_base_url';
const _defaultApiUrl = 'http://localhost:8080';

final _apiBaseUrlProvider = StateProvider<String>((ref) {
  final storage = ref.watch(storageServiceProvider);
  return storage.getString(_apiBaseUrlKey) ?? _defaultApiUrl;
});

class SettingsPage extends ConsumerWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final apiUrl = ref.watch(_apiBaseUrlProvider);

    return AppLayout(
      title: '设置',
      body: ListView(
        children: [
          Card(
            child: ListTile(
              leading: const Icon(Icons.api),
              title: const Text('API 地址'),
              subtitle: Text(apiUrl),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => _showApiConfigDialog(context, ref, apiUrl),
            ),
          ),
          const SizedBox(height: 8),
          Card(
            child: ListTile(
              leading: const Icon(Icons.info_outline),
              title: const Text('关于'),
              subtitle: const Text('房产数据管理系统 v1.0.0'),
              trailing: const Icon(Icons.chevron_right),
              onTap: () {
                showAboutDialog(
                  context: context,
                  applicationName: '房产管理系统',
                  applicationVersion: '1.0.0',
                  applicationLegalese: '© 2024',
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _showApiConfigDialog(
    BuildContext context,
    WidgetRef ref,
    String currentUrl,
  ) async {
    final controller = TextEditingController(text: currentUrl);
    final result = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('API 地址'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(
            hintText: 'http://localhost:8080',
            labelText: '服务器地址',
          ),
          autofocus: true,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('取消'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, controller.text),
            child: const Text('保存'),
          ),
        ],
      ),
    );

    if (result != null && result.isNotEmpty && result != currentUrl) {
      final storage = ref.read(storageServiceProvider);
      await storage.setString(_apiBaseUrlKey, result);
      ref.read(_apiBaseUrlProvider.notifier).state = result;

      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('API 地址已更新，重新进入页面生效')),
        );
      }
    }
  }
}

extension on StorageService {
  String? getString(String key) {
    return settingsBox.get(key) as String?;
  }

  Future<void> setString(String key, String value) async {
    await settingsBox.put(key, value);
  }
}