import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

interface LineChartProps {
  xData: string[];
  yData: number[];
  title?: string;
  yAxisLabel?: string;
}

export function LineChart({ xData, yData, title, yAxisLabel }: LineChartProps) {
  const option: EChartsOption = {
    title: title ? { text: title, left: 'center' } : undefined,
    tooltip: { trigger: 'axis' },
    grid: { left: 60, right: 20, bottom: 40 },
    xAxis: { type: 'category', data: xData, boundaryGap: false },
    yAxis: { type: 'value', name: yAxisLabel, axisLabel: { formatter: (v: number) => v.toLocaleString() } },
    series: [
      {
        type: 'line',
        smooth: true,
        data: yData,
        areaStyle: { color: 'rgba(59, 130, 246, 0.2)' },
        lineStyle: { color: '#3b82f6', width: 2 },
        itemStyle: { color: '#3b82f6' },
        symbol: 'circle',
        symbolSize: 6,
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 360 }} />;
}
