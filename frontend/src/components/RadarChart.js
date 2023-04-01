import React, { useEffect, useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import companiesData from '../wordMapFinalOutput.json';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function RadarChart({ selectedCompany }) {
  const labels = [
    'Very Positive',
    'Positive',
    'Neutral',
    'Negative',
    'Very Negative',
  ];

  const companiesArray = useMemo(() => {
    return Object.entries(companiesData).map(([company, data]) => ({
      company,
      breakdown: data['Breakdown of Sentiments'],
    }));
  }, [companiesData]);

  const totalReviews = labels.reduce((acc, label) => {
    acc[label] = companiesArray.reduce(
      (sum, { breakdown }) => sum + breakdown[label],
      0
    );
    return acc;
  }, {});

  const averageReviews = {};
  for (const label of labels) {
    averageReviews[label] = totalReviews[label] / companiesArray.length;
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Number of Reviews: ${selectedCompany} vs. Others`,
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

  const [chartDataConfig, setChartDataConfig] = useState({
    labels: labels,
    datasets: [
      {
        label: selectedCompany,
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Other Companies',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const selectedCompanyData = companiesArray.find(
      ({ company }) => company === selectedCompany
    );

    const totalReviews = labels.reduce((acc, label) => {
      acc[label] = companiesArray.reduce(
        (sum, { breakdown }) => sum + breakdown[label],
        0
      );
      return acc;
    }, {});

    const averageReviews = {};
    for (const label of labels) {
      averageReviews[label] = totalReviews[label] / companiesArray.length;
    }

    const updatedChartDataConfig = {
      ...chartDataConfig,
      datasets: [
        {
          ...chartDataConfig.datasets[0],
          label: selectedCompany,
          data: Object.values(selectedCompanyData.breakdown),
        },
        {
          ...chartDataConfig.datasets[1],
          data: Object.values(averageReviews),
        },
      ],
    };

    setChartDataConfig(updatedChartDataConfig);
  }, [selectedCompany, companiesArray]);

  return <Radar data={chartDataConfig} options={chartOptions} />;
}

export default RadarChart;
