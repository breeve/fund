import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

interface PieChartProps {
  data: { name: string; value: number }[];
  title?: string;
}

export function PieChart({ data, title }: PieChartProps) {
  const option: EChartsOption = {
    title: title ? { text: title, left: 'center' } : undefined,
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, type: 'scroll' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {d}%' },
        emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
        data,
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 360 }} />;
}
