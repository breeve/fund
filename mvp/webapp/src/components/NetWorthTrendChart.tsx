import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { TrendPoint } from '@/types';
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface NetWorthTrendChartProps {
  data?: TrendPoint[];
  dateRange?: '1M' | '3M' | '1Y' | 'ALL';
}

// Generate mock trend data
function generateMockTrendData(range: '1M' | '3M' | '1Y' | 'ALL'): TrendPoint[] {
  const now = new Date();
  let months = 1;
  switch (range) {
    case '1M': months = 1; break;
    case '3M': months = 3; break;
    case '1Y': months = 12; break;
    case 'ALL': months = 24; break;
  }

  const data: TrendPoint[] = [];
  let netAssets = 1500000; // Starting point

  for (let i = months * 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Random walk with slight upward bias
    const change = (Math.random() - 0.48) * 5000;
    netAssets += change;

    data.push({
      date: format(date, 'yyyy-MM-dd'),
      netAssets: Math.round(netAssets),
      totalAssets: Math.round(netAssets * 1.2),
      totalLiabilities: Math.round(netAssets * 0.2),
    });
  }

  return data;
}

export function NetWorthTrendChart({
  data,
  dateRange = '3M',
}: NetWorthTrendChartProps) {
  const trendData = data ?? generateMockTrendData(dateRange);

  const option: EChartsOption = {
    title: {
      text: '净资产趋势',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 600 },
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: unknown) => {
        const pArr = params as Array<{ axisValue: string; seriesName: string; value: number }>;
        if (!pArr?.[0]) return '';
        let result = `${pArr[0].axisValue}<br/>`;
        pArr.forEach((p) => {
          result += `${p.seriesName}: ${(p.value / 10000).toFixed(2)}万<br/>`;
        });
        return result;
      },
    },
    legend: {
      data: ['净资产', '总资产', '总负债'],
      top: 30,
    },
    grid: {
      left: 60,
      right: 20,
      top: 70,
      bottom: 30,
    },
    xAxis: {
      type: 'category',
      data: trendData.map((d) => d.date),
      boundaryGap: false,
      axisLabel: {
        formatter: (value: string) => {
          const date = parseISO(value);
          return format(date, 'MM/dd', { locale: zhCN });
        },
        interval: Math.floor(trendData.length / 6),
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => `${(value / 10000).toFixed(0)}万`,
      },
    },
    series: [
      {
        name: '净资产',
        type: 'line',
        data: trendData.map((d) => d.netAssets),
        smooth: true,
        lineStyle: { width: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(37, 99, 235, 0.3)' },
              { offset: 1, color: 'rgba(37, 99, 235, 0.05)' },
            ],
          },
        },
      },
      {
        name: '总资产',
        type: 'line',
        data: trendData.map((d) => d.totalAssets),
        smooth: true,
        lineStyle: { width: 1, type: 'dashed' },
      },
      {
        name: '总负债',
        type: 'line',
        data: trendData.map((d) => d.totalLiabilities),
        smooth: true,
        lineStyle: { width: 1, type: 'dashed' },
      },
    ],
  };

  return (
    <ReactECharts option={option} style={{ height: 300 }} opts={{ renderer: 'svg' }} />
  );
}