import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ data, title }) {
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.parsed;
            const percentage = (
              (value / data.reduce((a, b) => a + b, 0)) *
              100
            ).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const labels = [
    'Very Positive',
    'Positive',
    'Neutral',
    'Negative',
    'Very Negative',
  ];

  const chartDataConfig = {
    labels: labels,
    datasets: [
      {
        label: '# of Reviews',
        data: data,
        backgroundColor: [
          'rgba(0, 128, 0, 0.5)',
          'rgba(128, 255, 128, 0.5)',
          'rgba(128, 128, 128, 0.5)',
          'rgba(255, 128, 128, 0.5)',
          'rgba(128, 0, 0, 0.5)',
        ],
        borderColor: [
          'rgba(0, 128, 0, 1)',
          'rgba(128, 255, 128, 1)',
          'rgba(128, 128, 128, 1)',
          'rgba(255, 128, 128, 1)',
          'rgba(128, 0, 0,1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={chartDataConfig} options={chartOptions} />;
}

export default PieChart;
