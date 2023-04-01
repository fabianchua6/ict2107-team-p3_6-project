import React from 'react';
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

  const companiesArray = Object.entries(companiesData).map(
    ([company, data]) => ({
      company,
      breakdown: data['Breakdown of Sentiments'],
      totalReviews: data['Number of Reviews Analysed'],
    })
  );

  const selectedCompanyData = companiesArray.find(
    ({ company }) => company === selectedCompany
  );
  const selectedCompanyScores = {};
  labels.forEach(label => {
    selectedCompanyScores[label] =
      selectedCompanyData.breakdown[label] / selectedCompanyData.totalReviews;
  });

  const otherCompaniesData = companiesArray
    .filter(({ company }) => company !== selectedCompany)
    .map(({ breakdown, totalReviews }) => {
      const scores = {};
      labels.forEach(label => {
        scores[label] = breakdown[label] / totalReviews;
      });
      return scores;
    });

  const otherCompaniesAverage = {};
  labels.forEach(label => {
    const sum = otherCompaniesData.reduce(
      (total, current) => total + current[label],
      0
    );
    otherCompaniesAverage[label] = sum / otherCompaniesData.length;
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Sentiment Breakdown: ${selectedCompany} vs. Others`,
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
        label: selectedCompany,
        data: Object.values(selectedCompanyScores),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Other Companies',
        data: Object.values(otherCompaniesAverage),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return <Radar data={chartDataConfig} options={chartOptions} />;
}

export default RadarChart;
