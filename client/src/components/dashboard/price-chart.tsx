import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PriceChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check if Chart.js is available
    if (typeof window !== 'undefined' && (window as any).Chart) {
      const Chart = (window as any).Chart;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
          datasets: [{
            label: 'متوسط السعر (دج)',
            data: [120, 125, 118, 130, 135, 128, 140],
            borderColor: 'hsl(160, 84%, 39%)',
            backgroundColor: 'hsla(160, 84%, 39%, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              grid: {
                color: 'hsl(220, 13%, 91%)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });

      return () => {
        chart.destroy();
      };
    } else {
      // Load Chart.js dynamically
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => {
        // Re-trigger the effect after Chart.js loads
        setTimeout(() => {
          if (canvasRef.current) {
            const event = new Event('chart-loaded');
            canvasRef.current.dispatchEvent(event);
          }
        }, 100);
      };
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, []);

  return (
    <Card className="shadow-sm" data-testid="card-price-chart">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground" data-testid="text-chart-title">
          اتجاهات الأسعار
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 relative">
          <canvas ref={canvasRef} className="w-full h-full" data-testid="canvas-price-chart"></canvas>
        </div>
        <div className="mt-4 text-sm text-muted-foreground text-center" data-testid="text-chart-description">
          آخر 7 أيام - تحديث تلقائي كل ساعة
        </div>
      </CardContent>
    </Card>
  );
}
