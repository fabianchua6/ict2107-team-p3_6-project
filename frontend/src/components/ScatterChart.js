import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import companiesData from '../wordMapFinalOutput.json';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip);

export const options = {
  scales: {
    x: {
      type: 'linear',
      position: 'bottom',
      title: {
        display: true,
        text: 'Number of Reviews Analysed',
      },
      ticks: {
        beginAtZero: true,
      },
    },
    y: {
      type: 'linear',
      position: 'left',
      title: {
        display: true,
        text: 'Average Sentiment per Review',
      },
      ticks: {
        beginAtZero: true,
      },
    },
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          const label = context.dataset.label || '';
          if (label) {
            return `${label}: (${context.parsed.x}, ${context.parsed.y})`;
          } else {
            return `(${context.parsed.x}, ${context.parsed.y})`;
          }
        },
      },
    },
    afterDraw: chart => {
      const ctx = chart.canvas.getContext('2d');
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        meta.data.forEach((point, index) => {
          ctx.fillStyle = dataset.borderColor;
          const position = point.getCenterPoint();
          const text = dataset.label;
          ctx.fillText(text, position.x + 5, position.y - 5);
        });
      });
    },
  },
};

const companiesArray = Object.entries(companiesData).map(([company, data]) => ({
  company,
  totalReviews: data['Number of Reviews Analysed'],
  averageSentiment: data['Average sentiment per review'],
  breakdown: data['Breakdown of Sentiments'],
}));

function generateScatterChartData(selectedCompany) {
  const pointRadius = 5;
  const pointHoverRadius = 8;
  const borderWidth = 1;
  const selectedBorderWidth = 3;

  return companiesArray.map(({ company, totalReviews, averageSentiment }) => ({
    label: company,
    data: [{ x: totalReviews, y: averageSentiment }],
    backgroundColor:
      company === selectedCompany
        ? 'rgba(255, 99, 132, 1)'
        : 'rgba(54, 162, 235, 1)',
    borderColor:
      company === selectedCompany
        ? 'rgba(255, 99, 132, 1)'
        : 'rgba(54, 162, 235, 1)',
    pointRadius: company === selectedCompany ? pointHoverRadius : pointRadius,
    pointHoverRadius,
    borderWidth:
      company === selectedCompany ? selectedBorderWidth : borderWidth,
  }));
}

export function ScatterChart({ selectedCompany }) {
  const chartData = {
    datasets: generateScatterChartData(selectedCompany),
  };

  return <Scatter options={options} data={chartData} />;
}
