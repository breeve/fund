import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { AssetCategory } from '@/types';
import { CATEGORY_NAMES, CATEGORY_COLORS } from '@/types';

interface CategoryPieChartProps {
  data: Record<AssetCategory, number>;
  title?: string;
}

export function CategoryPieChart({ data, title }: CategoryPieChartProps) {
  // Filter out zero values and liabilities for assets view
  const filteredData = Object.entries(data)
    .filter(([, value]) => value > 0)
    .filter(([key]) => key !== 'liability')
    .map(([key, value]) => ({
      name: CATEGORY_NAMES[key as AssetCategory],
      value: Math.round(value / 10000 * 100) / 100, // Convert to 万
      itemStyle: { color: CATEGORY_COLORS[key as AssetCategory] },
    }));

  const option: EChartsOption = {
    title: {
      text: title ?? '资产构成',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 600 },
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: unknown) => {
        const p = params as { name: string; value: number };
        return `${p.name}: ${p.value.toFixed(2)}万`;
      },
    },
    legend: {
      orient: 'vertical',
      right: 20,
      top: 'center',
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: 'var(--color-surface)',
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: '{b}\n{d}%',
        },
        data: filteredData,
      },
    ],
  };

  return (
    <ReactECharts option={option} style={{ height: 300 }} opts={{ renderer: 'svg' }} />
  );
}