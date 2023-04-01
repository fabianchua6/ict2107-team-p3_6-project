import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export default function PolarPie(props) {
  const { data, title } = props;

  const labels = [
    'Very Positive',
    'Positive',
    'Neutral',
    'Negative',
    'Very Negative',
  ];
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
    },
    scales: {
      r: {
        pointLabels: {
          display: true,
          centerPointLabels: true,
          font: {
            size: 18,
          },
        },
      },
    },
  };

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
        borderWidth: 1,
      },
    ],
  };

  return <PolarArea data={chartDataConfig} options={chartOptions} />;
}
