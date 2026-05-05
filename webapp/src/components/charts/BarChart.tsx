import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

interface BarChartProps {
  xData: string[];
  yData: number[];
  title?: string;
  horizontal?: boolean;
}

export function BarChart({ xData, yData, title, horizontal }: BarChartProps) {
  const option: EChartsOption = {
    title: title ? { text: title, left: 'center' } : undefined,
    tooltip: { trigger: 'axis' },
    grid: { left: 60, right: 20, bottom: 40 },
    xAxis: horizontal ? { type: 'value' } : { type: 'category', data: xData },
    yAxis: horizontal ? { type: 'category', data: xData } : { type: 'value' },
    series: [
      {
        type: 'bar',
        data: yData,
        itemStyle: { color: '#3b82f6', borderRadius: horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0] },
        label: { show: true, position: 'right' },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 360 }} />;
}
