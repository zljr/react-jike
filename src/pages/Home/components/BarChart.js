
import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

function BarChart({ title }) {
  const chartRef = useRef(null);
  useEffect(() => {
    const chartDom = chartRef.current;
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      const option = {
        title: {
          text: title,
        },
        xAxis: {
          type: 'category',
          data: ['Vue', 'React', 'Angular'],
        },
        yAxis: {
          type: 'value',
        },
        tooltip: {
          trigger: 'axis',
        },
        series: [
          {
            data: [300, 200, 150],
            type: 'bar',
          },
        ],
      };
      myChart.setOption(option);
      const handleResize = () => {
        if (chartDom) {
          myChart.resize();
        }
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        if (myChart) {
          myChart.dispose();
        }
      };
    }
  }, []);
  return (
        <div ref={chartRef} style={{ width: '100%', height: '400px' }}>
        </div>
  );
}
export default BarChart;
