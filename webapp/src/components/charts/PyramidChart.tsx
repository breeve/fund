import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

interface PyramidChartProps {
  data: { name: string; value: number }[];
  title?: string;
}

export function PyramidChart({ data, title }: PyramidChartProps) {
  const option: EChartsOption = {
    title: title ? { text: title, left: 'center' } : undefined,
    tooltip: { trigger: 'item', formatter: '{b}: {c}' },
    series: [
      {
        type: 'funnel',
        left: '10%',
        top: 40,
        bottom: 40,
        width: '80%',
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: { show: true, position: 'inside', formatter: '{b}: {c}' },
        labelLine: { show: false },
        itemStyle: { borderColor: '#fff', borderWidth: 1 },
        emphasis: { label: { fontSize: 16 } },
        data,
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 400 }} />;
}
