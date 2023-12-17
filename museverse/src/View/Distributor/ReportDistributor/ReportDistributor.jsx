import React, { useEffect } from 'react'
import Chart from 'chart.js/auto';

function ReportDistributor() {
  useEffect(() => {
    const data = {
      labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5'],
      datasets: [
        {
          label: 'Doanh thu',
          data: [1500, 2000, 1800, 2500, 3000],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    // Lấy tham chiếu đến canvas element
    const ctx = document.getElementById('myChart').getContext('2d');

    // Tạo biểu đồ
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: data,
    });

    // Cleanup khi component unmount
    return () => myChart.destroy();
  }, []); // Chỉ gọi một lần khi component mount

  return (
    <div>
      <h2>Biểu đồ doanh thu theo tháng</h2>
      <canvas id="myChart" width="400" height="200"></canvas>
    </div>
  );
}

export default ReportDistributor