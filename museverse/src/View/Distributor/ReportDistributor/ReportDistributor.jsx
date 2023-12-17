import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';

// ReportDistributor
function ReportDistributor() {
  const chartRef = useRef(null);
  const [selectedYear, setSelectedYear] = useState('');
  const [years, setYears] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [chartInstance, setChartInstance] = useState(null);

  const fetchData = async () => {
      try {
          const response = await axios.get('http://127.0.0.1:8000/api/report/user', { params: { year: selectedYear } });
          const responseData = response.data;
          const labels = responseData?.months || [];
          const dataSets = responseData?.totals || [];
          const years = responseData?.years || [];

          setYears(years);

          const data = {
              labels: labels,
              datasets: [
                  {
                      label: 'Doanh thu',
                      data: dataSets,
                      backgroundColor: [
                          'rgba(255, 99, 132, 0.2)',
                          'rgba(255, 99, 132, 0.2)', // Màu hồng cho các cột
                          'rgba(255, 99, 132, 0.2)',
                          'rgba(255, 99, 132, 0.2)',
                          'rgba(255, 99, 132, 0.2)',
                          'rgba(255, 99, 132, 0.2)',
                          'rgba(255, 99, 132, 0.2)',
                          'rgba(255, 99, 132, 0.2)',
                          'rgba(255, 99, 132, 0.2)'
                      ],
                      borderColor: [
                          'rgba(255, 99, 132, 1)',
                          'rgba(255, 99, 132, 1)', // Màu hồng cho đường biên
                          'rgba(255, 99, 132, 1)',
                          'rgba(255, 99, 132, 1)',
                          'rgba(255, 99, 132, 1)',
                          'rgba(255, 99, 132, 1)',
                          'rgba(255, 99, 132, 1)',
                          'rgba(255, 99, 132, 1)',
                          'rgba(255, 99, 132, 1)'
                      ],
                      borderWidth: 1,
                  },
              ],
          };

          setChartData(data);
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  };

  useEffect(() => {
      fetchData();
  }, [selectedYear]);

  useEffect(() => {
      if (chartData) {
          if (chartInstance) {
              chartInstance.destroy();
          }

          const ctx = chartRef.current.getContext('2d');
          const newChartInstance = new Chart(ctx, {
              type: 'bar',
              data: chartData,
          });

          setChartInstance(newChartInstance);
      }
  }, [chartData]);

  function handleYearChange(event) {
      setSelectedYear(event.target.value);
  }

  const myStyle = {
      display: 'flex',
      justifyContent: 'flex-end',
      marginRight: '50px',
  };
  return (
      <div>
          <h2>Biểu đồ doanh thu theo tháng</h2>
          <div style={myStyle}>>
              <select value={selectedYear} onChange={handleYearChange}>
                  <option value="">Tất cả</option>
                  {years.map((year) => (
                      <option key={year} value={year}>
                          {year}
                      </option>
                  ))}
              </select>
          </div>
          <canvas ref={chartRef} width="400" height="200"></canvas>
      </div>
  );
}

export default ReportDistributor