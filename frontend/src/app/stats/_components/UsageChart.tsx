'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chart, registerables } from 'chart.js';
import { useEffect, useRef } from 'react';

Chart.register(...registerables);

export function UsageChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // 既存のチャートを破棄
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // ダミーデータ
    const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
    const usageRates = [95, 100, 92, 98, 100, 96];

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: '服用率 (%)',
            data: usageRates,
            backgroundColor: 'rgba(34, 197, 94, 0.6)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => `服用率: ${context.raw}%`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value) => `${value}%`,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardTitle className='text-center'>月別服用率</CardTitle>
      </CardHeader>
      <CardContent>
        <canvas ref={chartRef} height='200' />
      </CardContent>
    </Card>
  );
}
