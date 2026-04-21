import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/house_api.dart';
import '../theme/app_theme.dart';
import '../widgets/app_layout.dart';

class CommunityDetailPage extends ConsumerStatefulWidget {
  const CommunityDetailPage({super.key, required this.communityId});

  final int communityId;

  @override
  ConsumerState<CommunityDetailPage> createState() => _CommunityDetailPageState();
}

class _CommunityDetailPageState extends ConsumerState<CommunityDetailPage> {
  final _api = HouseApiService();
  Map<String, dynamic>? _community;
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadCommunity();
  }

  Future<void> _loadCommunity() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      final data = await _api.getCommunity(widget.communityId);
      setState(() {
        _community = data.toJson();
        _isLoading = false;
      });
    } on Exception catch (e) {
      setState(() {
        _error = '加载失败: $e';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_community?['name'] ?? '小区详情'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? EmptyState(
                  icon: Icons.error_outline,
                  message: _error!,
                  action: ElevatedButton(
                    onPressed: _loadCommunity,
                    child: const Text('重试'),
                  ),
                )
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildSection('基本信息', [
                        _buildInfoRow('小区名称', _community!['name']),
                        _buildInfoRow('官方名称', _community!['official_name']),
                        _buildInfoRow('地址', _community!['address']),
                        _buildInfoRow('建成年代', _community!['completion_year']?.toString()),
                      ]),
                      const SizedBox(height: 24),
                      _buildSection('建筑信息', [
                        _buildInfoRow('占地面积', '${_community!['land_area']} ㎡'),
                        _buildInfoRow('建筑面积', '${_community!['building_area']} ㎡'),
                        _buildInfoRow('容积率', _community!['plot_ratio']?.toString()),
                        _buildInfoRow('绿化率', '${_community!['greening_rate']}%'),
                        _buildInfoRow('楼栋数', _community!['building_count']?.toString()),
                        _buildInfoRow('楼层数', _community!['floor_count']?.toString()),
                      ]),
                      const SizedBox(height: 24),
                      _buildSection('价格信息', [
                        _buildInfoRow('挂牌价格', '${_community!['listing_price']} 元/㎡'),
                        _buildInfoRow('成交价格', '${_community!['deal_price']} 元/㎡'),
                        _buildInfoRow('价格趋势', _community!['price_trend']),
                        _buildInfoRow('在售套数', _community!['on_sale_count']?.toString()),
                        _buildInfoRow('在租套数', _community!['on_rent_count']?.toString()),
                      ]),
                      const SizedBox(height: 24),
                      _buildSection('交通配套', [
                        _buildInfoRow('最近地铁', _community!['nearest_metro']),
                        _buildInfoRow('公交线路', (_community!['bus_lines'] as List?)?.join(', ')),
                      ]),
                      const SizedBox(height: 24),
                      _buildSection('教育配套', [
                        _buildInfoRow('对口学校', _community!['assigned_school']),
                      ]),
                      const SizedBox(height: 24),
                      _buildSection('环境安全', [
                        _buildInfoRow('园林景观', _community!['garden_landscape']),
                        _buildInfoRow('物业等级', _community!['property_mgmt_level']),
                        _buildInfoRow('安保', _community!['security']),
                        _buildInfoRow('人车分流', _community!['pedestrian_vehicle_separation'] == true ? '是' : '否'),
                        _buildInfoRow('电梯品牌', _community!['elevator_brand']),
                        _buildInfoRow('淹水风险', _community!['flooding_risk'] == true ? '有' : '无'),
                      ]),
                      const SizedBox(height: 24),
                      _buildSection('口碑', [
                        _buildInfoRow('评分', _community!['rating']?.toString()),
                        _buildInfoRow('诉讼历史', _community!['has_litigation_history'] == true ? '有' : '无'),
                        _buildInfoRow('负面新闻', _community!['has_negative_news'] == true ? '有' : '无'),
                      ]),
                    ],
                  ),
                ),
    );
  }

  Widget _buildSection(String title, List<Widget> children) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SectionHeader(title: title),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(children: children),
          ),
        ),
      ],
    );
  }

  Widget _buildInfoRow(String label, String? value) {
    if (value == null || value.isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: const TextStyle(color: AppTheme.textSecondary),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(color: AppTheme.textPrimary),
            ),
          ),
        ],
      ),
    );
  }
}
