import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../stores/asset_store.dart';
import '../widgets/app_layout.dart';
import '../theme/app_theme.dart';
import '../models/datasource_config.dart';

class SettingsPage extends ConsumerStatefulWidget {
  const SettingsPage({super.key});

  @override
  ConsumerState<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends ConsumerState<SettingsPage> {
  final DataSourceConfigStore _configStore = DataSourceConfigStore();
  String _currentDataSource = 'eastmoney';

  @override
  void initState() {
    super.initState();
    _loadConfig();
  }

  Future<void> _loadConfig() async {
    await _configStore.init();
    if (mounted) {
      setState(() {
        _currentDataSource = _configStore.currentDataSourceId;
      });
    }
  }

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
                subtitle: _getDataSourceName(_currentDataSource),
                onTap: () => _showDataSourceDialog(),
              ),
              _buildSettingItem(
                icon: Icons.link,
                title: 'API 端点',
                subtitle: 'http://localhost:8081',
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

  String _getDataSourceName(String id) {
    switch (id) {
      case 'eastmoney':
        return '东方财富 (EastMoney)';
      case 'eastmoney_f10':
        return '东方财富 F10 (EastMoney F10)';
      default:
        return '东方财富 (EastMoney)';
    }
  }

  void _showDataSourceDialog() {
    showDialog(
      context: context,
      builder: (dialogCtx) => AlertDialog(
        title: const Text('选择数据源'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: availableDataSources.map((ds) {
            return ListTile(
              leading: Radio<String>(
                value: ds.id,
                groupValue: _currentDataSource,
                onChanged: (value) async {
                  if (value != null) {
                    await _configStore.setDataSource(value);
                    if (mounted) {
                      setState(() {
                        _currentDataSource = value;
                      });
                    }
                    if (dialogCtx.mounted) {
                      Navigator.of(dialogCtx).pop();
                    }
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('已切换到 ${_getDataSourceName(value)}')),
                      );
                    }
                  }
                },
              ),
              title: Text(ds.name),
              subtitle: Text(ds.description),
              onTap: () async {
                await _configStore.setDataSource(ds.id);
                if (mounted) {
                  setState(() {
                    _currentDataSource = ds.id;
                  });
                }
                if (dialogCtx.mounted) {
                  Navigator.of(dialogCtx).pop();
                }
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('已切换到 ${_getDataSourceName(ds.id)}')),
                  );
                }
              },
            );
          }).toList(),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogCtx).pop(),
            child: const Text('取消'),
          ),
        ],
      ),
    );
  }
}
