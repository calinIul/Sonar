import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';


ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);


const GenrePieChart = ({ history, setHistory }) => {
  
  if (history && Object.entries(history).length > 0) {
    const data = {
      labels: Object.keys(history), // Genre tags
      datasets: [
        {
          data: Object.values(history), 
          backgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
          ],
          hoverBackgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
          ],
        },
      ],
    };

    const options = {
      plugins: {
        legend: {
          display: false, // Keep the legend visible
        },
        tooltip: {
          enabled: true, // Enable tooltips on hover
          callbacks: {
            label: (context) => {
              
              const value = context.raw || 0;
              const total = context.chart._metasets[0].total;
              const percentage = ((value / total) * 100).toFixed(2);
              return `${percentage}%`;
            },
          },
        },
        datalabels: {
          color: '#000', // Label color
          font: {
            weight: 'bold',
            size: 12,
          },
          formatter: (value, context) => {
            const dataIndex = context.dataIndex; 
            const label = context.chart.data.labels[dataIndex];
            
            return `${label}`; 
        },
        
        },
      },
    };

    return (
      <div className="pie-chart">
        <h3>Listening history
          <button onClick={() => setHistory({})}>Clear</button>
        </h3>
        <Pie data={data} options={options} />
      </div>
    );
  }

  return;
};

export default GenrePieChart;
