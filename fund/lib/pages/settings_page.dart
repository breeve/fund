import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../stores/asset_store.dart';
import '../widgets/app_layout.dart';
import '../theme/app_theme.dart';

class SettingsPage extends ConsumerStatefulWidget {
  const SettingsPage({super.key});

  @override
  ConsumerState<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends ConsumerState<SettingsPage> {
  @override
  Widget build(BuildContext context) {
    return AppLayout(
      title: '设置',
      body: ListView(
        children: [
          _buildSection(
            '通用设置',
            [
              _buildSettingItem(
                icon: Icons.palette_outlined,
                title: '主题',
                subtitle: '跟随系统',
                onTap: () {},
              ),
              _buildSettingItem(
                icon: Icons.language,
                title: '语言',
                subtitle: '简体中文',
                onTap: () {},
              ),
              _buildSettingItem(
                icon: Icons.attach_money,
                title: '货币',
                subtitle: '人民币 (CNY)',
                onTap: () {},
              ),
            ],
          ),
          const SizedBox(height: 24),
          _buildSection(
            '数据管理',
            [
              _buildSettingItem(
                icon: Icons.cloud_upload_outlined,
                title: '导出数据',
                subtitle: '导出为 JSON/CSV/Excel',
                onTap: () => _showExportDialog(),
              ),
              _buildSettingItem(
                icon: Icons.cloud_download_outlined,
                title: '导入数据',
                subtitle: '从备份文件恢复',
                onTap: () {},
              ),
              _buildSettingItem(
                icon: Icons.delete_outline,
                title: '清空数据',
                subtitle: '删除所有资产数据',
                onTap: () => _showClearDataDialog(),
                isDestructive: true,
              ),
            ],
          ),
          const SizedBox(height: 24),
          _buildSection(
            '基金数据源',
            [
              _buildSettingItem(
                icon: Icons.api,
                title: '数据提供商',
                subtitle: '东方财富 (EastMoney)',
                onTap: () {},
              ),
              _buildSettingItem(
                icon: Icons.link,
                title: 'API 端点',
                subtitle: '使用默认端点',
                onTap: () {},
              ),
            ],
          ),
          const SizedBox(height: 24),
          _buildSection(
            '关于',
            [
              _buildSettingItem(
                icon: Icons.info_outline,
                title: '版本',
                subtitle: '1.0.0',
                onTap: () {},
              ),
              _buildSettingItem(
                icon: Icons.code,
                title: '源代码',
                subtitle: 'GitHub',
                onTap: () {},
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSection(String title, List<Widget> items) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 4, bottom: 8),
          child: Text(
            title,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: AppTheme.textSecondary,
            ),
          ),
        ),
        Card(
          child: Column(
            children: items.asMap().entries.map((entry) {
              final index = entry.key;
              final item = entry.value;
              return Column(
                children: [
                  item,
                  if (index < items.length - 1)
                    const Divider(height: 1, indent: 56),
                ],
              );
            }).toList(),
          ),
        ),
      ],
    );
  }

  Widget _buildSettingItem({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
    bool isDestructive = false,
  }) {
    return ListTile(
      leading: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: isDestructive
              ? AppTheme.error.withValues(alpha: 0.1)
              : AppTheme.primary.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(
          icon,
          color: isDestructive ? AppTheme.error : AppTheme.primary,
          size: 20,
        ),
      ),
      title: Text(
        title,
        style: TextStyle(
          fontWeight: FontWeight.w500,
          color: isDestructive ? AppTheme.error : null,
        ),
      ),
      subtitle: Text(
        subtitle,
        style: const TextStyle(fontSize: 13),
      ),
      trailing: const Icon(Icons.chevron_right, size: 20),
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
    );
  }

  void _showExportDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('导出数据'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.data_object),
              title: const Text('JSON'),
              onTap: () {
                Navigator.of(ctx).pop();
                _exportData('json');
              },
            ),
            ListTile(
              leading: const Icon(Icons.table_chart),
              title: const Text('CSV'),
              onTap: () {
                Navigator.of(ctx).pop();
                _exportData('csv');
              },
            ),
            ListTile(
              leading: const Icon(Icons.grid_on),
              title: const Text('Excel'),
              onTap: () {
                Navigator.of(ctx).pop();
                _exportData('excel');
              },
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('取消'),
          ),
        ],
      ),
    );
  }

  void _exportData(String format) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('导出 $format 格式 (功能开发中)')),
    );
  }

  void _showClearDataDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('清空数据'),
        content: const Text(
          '确定要删除所有资产数据吗？此操作不可撤销。',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('取消'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.of(ctx).pop();
              final storage = ref.read(storageServiceProvider);
              await storage.clearAssets();
              if (mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('数据已清空')),
                );
              }
            },
            style: TextButton.styleFrom(foregroundColor: AppTheme.error),
            child: const Text('删除'),
          ),
        ],
      ),
    );
  }
}
