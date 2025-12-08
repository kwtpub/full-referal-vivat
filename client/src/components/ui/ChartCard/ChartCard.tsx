import { useEffect, useRef } from 'react';
import {
  Chart,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  LineController,
  Filler,
  Tooltip,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import './ChartCard.css';

Chart.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  LineController,
  Filler,
  Tooltip,
);

export interface ChartDataPoint {
  date: number | Date | string;
  value: number;
}

export interface ChartCardProps {
  data: ChartDataPoint[] | number[];
  className?: string;
  label?: string;
  gradientColors?: {
    start: string;
    middle: string;
    end: string;
  };
}

const ChartCard = ({
  data,
  className = '',
  label = 'Данные',
  gradientColors = {
    start: '#FF383C',
    middle: '#FFAE00',
    end: '#FFD900',
  },
}: ChartCardProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // Нормализация данных: если передан массив чисел, преобразуем в формат с датами
  const normalizeData = (inputData: ChartDataPoint[] | number[]): ChartDataPoint[] => {
    if (inputData.length === 0) {
      return [];
    }

    // Если массив чисел, создаем данные с последовательными датами
    if (typeof inputData[0] === 'number' && !('date' in (inputData[0] as any))) {
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      return (inputData as number[]).map((value, index) => ({
        date: now - (inputData.length - 1 - index) * oneDay,
        value,
      }));
    }

    // Если уже массив объектов, нормализуем даты
    return (inputData as ChartDataPoint[]).map((item) => {
      let dateValue: number;
      if (typeof item.date === 'string') {
        dateValue = new Date(item.date).getTime();
      } else if (item.date instanceof Date) {
        dateValue = item.date.getTime();
      } else {
        dateValue = item.date;
      }

      return {
        date: dateValue,
        value: item.value,
      };
    });
  };

  const lineData = normalizeData(data);

  // Функция для рисования плавной линии
  const drawSmoothLine = (ctx: CanvasRenderingContext2D, points: any[]) => {
    ctx.beginPath();

    if (points.length > 0) {
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 0; i < points.length - 1; i++) {
        const currentPoint = points[i];
        const nextPoint = points[i + 1];

        const cp1x = currentPoint.x + (nextPoint.x - currentPoint.x) / 3;
        const cp1y = currentPoint.y;
        const cp2x = currentPoint.x + (nextPoint.x - currentPoint.x) * 2 / 3;
        const cp2y = nextPoint.y;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, nextPoint.x, nextPoint.y);
      }
    }
  };

  useEffect(() => {
    if (!chartRef.current || lineData.length === 0) return;
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartRef.current.style.backgroundColor = '#000000';

    // Функция для создания градиента
    const createGradient = (chart: Chart) => {
      const chartArea = chart.chartArea;
      if (!chartArea) {
        return null;
      }

      const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
      gradient.addColorStop(0, gradientColors.start);
      gradient.addColorStop(0.5, gradientColors.middle);
      gradient.addColorStop(1, gradientColors.end);

      return gradient;
    };

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: label,
            data: lineData.map((item) => ({ x: new Date(item.date), y: item.value })),
            borderColor: gradientColors.start,
            borderWidth: 0,
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
            },
            display: false,
            grid: {
              display: false,
            },
            ticks: {
              display: false,
            },
          },
          y: {
            display: false,
            grid: {
              display: false,
            },
            ticks: {
              display: false,
            },
          },
        },
      },
      plugins: [
        {
          id: 'customCanvasBackgroundColor',
          beforeDraw: (chart) => {
            const ctx = chart.canvas.getContext('2d');
            if (!ctx) return;
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
          },
        },
        {
          id: 'lineGlow',
          afterDatasetsDraw: (chart) => {
            const ctx = chart.ctx;
            const dataset = chart.data.datasets[0];
            const meta = chart.getDatasetMeta(0);

            if (meta.data.length === 0) return;

            const gradient = createGradient(chart);
            const lineColor = gradient || dataset.borderColor;

            ctx.save();

            const points = meta.data;

            if (points.length > 0) {
              const chartHeight = chart.chartArea
                ? chart.chartArea.bottom - chart.chartArea.top
                : 200;
              const scaleFactor = Math.min(chartHeight / 300, 1);

              // Слой 1 - желтое свечение
              ctx.shadowBlur = 22.93 * scaleFactor;
              ctx.shadowColor = 'rgba(255, 217, 0, 0.8)';
              ctx.strokeStyle = lineColor as string;
              ctx.lineWidth = 2.05 * scaleFactor;
              ctx.lineCap = 'round';
              ctx.lineJoin = 'round';
              drawSmoothLine(ctx, points);
              ctx.stroke();

              // Слой 2 - оранжевое свечение
              ctx.shadowBlur = 15 * scaleFactor;
              ctx.shadowColor = 'rgba(255, 174, 0, 0.6)';
              ctx.lineWidth = 4 * scaleFactor;
              drawSmoothLine(ctx, points);
              ctx.stroke();

              // Слой 3 - красное свечение
              ctx.shadowBlur = 10 * scaleFactor;
              ctx.shadowColor = 'rgba(255, 56, 60, 0.5)';
              ctx.lineWidth = 3 * scaleFactor;
              drawSmoothLine(ctx, points);
              ctx.stroke();

              // Основная линия с градиентом
              ctx.shadowBlur = 0;
              ctx.strokeStyle = lineColor as string;
              ctx.lineWidth = 2 * scaleFactor;
              drawSmoothLine(ctx, points);
              ctx.stroke();
            }

            ctx.restore();
          },
        },
      ],
    });

    chartInstanceRef.current = chart;

    // Обновляем градиент после первой отрисовки
    const updateGradient = () => {
      const gradient = createGradient(chart);
      if (gradient) {
        chart.data.datasets[0].borderColor = gradient;
        chart.update('none');
      }
    };

    chart.update();
    setTimeout(updateGradient, 100);

    // Обновляем градиент при изменении размера
    const handleResize = () => {
      setTimeout(updateGradient, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  // Обновление данных при изменении
  useEffect(() => {
    if (!chartInstanceRef.current || lineData.length === 0) return;

    const chart = chartInstanceRef.current;
    const ctx = chart.ctx;

    // Функция для создания градиента
    const createGradient = (chartInstance: Chart) => {
      const chartArea = chartInstance.chartArea;
      if (!chartArea) {
        return null;
      }

      const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
      gradient.addColorStop(0, gradientColors.start);
      gradient.addColorStop(0.5, gradientColors.middle);
      gradient.addColorStop(1, gradientColors.end);

      return gradient;
    };

    chart.data.datasets[0].data = lineData.map((item) => ({
      x: new Date(item.date),
      y: item.value,
    }));
    chart.data.datasets[0].label = label;

    const gradient = createGradient(chart);
    if (gradient) {
      chart.data.datasets[0].borderColor = gradient;
    }

    chart.update('none');
  }, [lineData, label, gradientColors]);

  return (
    <div className={`chart-card ${className}`}>
      <div className="chart-card-container">
        <canvas ref={chartRef} className="chart-card-canvas" />
      </div>
    </div>
  );
};

export default ChartCard;

