'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chart, registerables } from 'chart.js';
import { useEffect, useRef } from 'react';

Chart.register(...registerables);

export function BleedingPatternChart() {
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
    const bleedingDays = [3, 2, 4, 3, 2, 3];

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: '出血日数',
            data: bleedingDays,
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            borderColor: 'rgba(239, 68, 68, 1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: 'rgba(239, 68, 68, 1)',
            pointRadius: 4,
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
              label: (context) => `出血日数: ${context.raw}日`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              callback: (value) => `${value}日`,
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
        <CardTitle className='text-center'>出血パターン</CardTitle>
      </CardHeader>
      <CardContent>
        <canvas ref={chartRef} height='200' />
      </CardContent>
    </Card>
  );
}
