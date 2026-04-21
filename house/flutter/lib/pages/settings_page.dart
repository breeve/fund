import 'package:flutter/material.dart';
import '../widgets/app_layout.dart';

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return AppLayout(
      title: '设置',
      body: ListView(
        children: [
          Card(
            child: ListTile(
              leading: const Icon(Icons.api),
              title: const Text('API 地址'),
              subtitle: const Text('http://localhost:8080'),
              trailing: const Icon(Icons.chevron_right),
              onTap: () {
                // TODO: Add API configuration
              },
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
}
