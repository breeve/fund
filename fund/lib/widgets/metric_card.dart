import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class MetricCard extends StatelessWidget {
  const MetricCard({
    super.key,
    required this.title,
    required this.value,
    this.subValue,
    this.change,
    this.icon,
    this.color = 'primary',
  });

  final String title;
  final String value;
  final String? subValue;
  final double? change;
  final String? icon;
  final String color;

  Color get _color {
    switch (color) {
      case 'success':
        return AppTheme.success;
      case 'warning':
        return AppTheme.warning;
      case 'error':
        return AppTheme.error;
      default:
        return AppTheme.primary;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                if (icon != null) ...[
                  Text(icon!, style: const TextStyle(fontSize: 24)),
                  const SizedBox(width: 8),
                ],
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 14,
                    color: AppTheme.textSecondary,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              value,
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: AppTheme.textPrimary,
              ),
            ),
            if (subValue != null || change != null) ...[
              const SizedBox(height: 8),
              Row(
                children: [
                  if (subValue != null)
                    Text(
                      subValue!,
                      style: TextStyle(
                        fontSize: 12,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                  if (change != null) ...[
                    if (subValue != null) const SizedBox(width: 8),
                    _buildChangeIndicator(),
                  ],
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildChangeIndicator() {
    final isPositive = change! >= 0;
    final color = isPositive ? AppTheme.success : AppTheme.error;
    final icon = isPositive ? '↑' : '↓';
    final text = '${change!.abs().toStringAsFixed(2)}%';

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        '$icon $text',
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: color,
        ),
      ),
    );
  }
}
