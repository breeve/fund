import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../theme/app_theme.dart';

class NetWorthTrendChart extends StatelessWidget {
  const NetWorthTrendChart({
    super.key,
    this.data,
    this.dateRange = '3M',
  });

  final List<TrendPoint>? data;
  final String dateRange;

  @override
  Widget build(BuildContext context) {
    if (data == null || data!.isEmpty) {
      return _buildEmptyState();
    }

    final spots = _buildSpots();
    final minY = spots.map((s) => s.y).reduce((a, b) => a < b ? a : b);
    final maxY = spots.map((s) => s.y).reduce((a, b) => a > b ? a : b);
    final padding = (maxY - minY) * 0.1;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              '净值走势',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            _buildDateRangeSelector(),
          ],
        ),
        const SizedBox(height: 16),
        Expanded(
          child: LineChart(
            LineChartData(
              gridData: FlGridData(
                show: true,
                drawVerticalLine: false,
                horizontalInterval: (maxY - minY) / 4,
                getDrawingHorizontalLine: (value) {
                  return FlLine(
                    color: AppTheme.border,
                    strokeWidth: 1,
                  );
                },
              ),
              titlesData: FlTitlesData(
                leftTitles: AxisTitles(
                  sideTitles: SideTitles(
                    showTitles: true,
                    reservedSize: 50,
                    getTitlesWidget: (value, meta) {
                      return Text(
                        '${(value / 10000).toStringAsFixed(0)}万',
                        style: TextStyle(
                          fontSize: 10,
                          color: AppTheme.textSecondary,
                        ),
                      );
                    },
                  ),
                ),
                bottomTitles: AxisTitles(
                  sideTitles: SideTitles(
                    showTitles: true,
                    reservedSize: 30,
                    interval: (spots.length / 4).ceilToDouble(),
                    getTitlesWidget: (value, meta) {
                      final index = value.toInt();
                      if (index < 0 || index >= data!.length) {
                        return const SizedBox();
                      }
                      return Text(
                        data![index].date.substring(5),
                        style: TextStyle(
                          fontSize: 10,
                          color: AppTheme.textSecondary,
                        ),
                      );
                    },
                  ),
                ),
                topTitles: const AxisTitles(
                  sideTitles: SideTitles(showTitles: false),
                ),
                rightTitles: const AxisTitles(
                  sideTitles: SideTitles(showTitles: false),
                ),
              ),
              borderData: FlBorderData(show: false),
              minX: 0,
              maxX: (spots.length - 1).toDouble(),
              minY: minY - padding,
              maxY: maxY + padding,
              lineBarsData: [
                LineChartBarData(
                  spots: spots,
                  isCurved: true,
                  color: AppTheme.primary,
                  barWidth: 2,
                  isStrokeCapRound: true,
                  dotData: const FlDotData(show: false),
                  belowBarData: BarAreaData(
                    show: true,
                    color: AppTheme.primary.withValues(alpha: 0.1),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.show_chart,
            size: 48,
            color: AppTheme.textSecondary.withValues(alpha: 0.5),
          ),
          const SizedBox(height: 8),
          Text(
            '暂无走势数据',
            style: TextStyle(
              color: AppTheme.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDateRangeSelector() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: AppTheme.bgLight,
        borderRadius: BorderRadius.circular(4),
      ),
      child: DropdownButton<String>(
        value: dateRange,
        underline: const SizedBox(),
        isDense: true,
        items: const [
          DropdownMenuItem(value: '1M', child: Text('1月')),
          DropdownMenuItem(value: '3M', child: Text('3月')),
          DropdownMenuItem(value: '6M', child: Text('6月')),
          DropdownMenuItem(value: '1Y', child: Text('1年')),
        ],
        onChanged: (value) {},
      ),
    );
  }

  List<FlSpot> _buildSpots() {
    return data!.asMap().entries.map((entry) {
      return FlSpot(entry.key.toDouble(), entry.value.netAssets);
    }).toList();
  }
}

class TrendPoint {
  final String date;
  final double netAssets;
  final double totalAssets;
  final double totalLiabilities;

  TrendPoint({
    required this.date,
    required this.netAssets,
    required this.totalAssets,
    required this.totalLiabilities,
  });
}
