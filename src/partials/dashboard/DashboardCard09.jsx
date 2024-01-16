import React, { useEffect, useState } from 'react';
import BarChart from '../../charts/BarChart01';

// Import utilities
import { tailwindConfig } from '../../utils/Utils';
import { categories, categoriesColors } from '../../utils/categories';

function DashboardCard09({ revenueByCategory }) {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const data = {
      labels: [
        ...categories,
      ],
      datasets: [
        // Light blue bars
        {
          label: 'Happy Hours',
          data: [
            ...revenueByCategory,
          ],
          backgroundColor: [tailwindConfig().theme.colors.blue[500], tailwindConfig().theme.colors.green[500], tailwindConfig().theme.colors.purple[500]],
          hoverBackgroundColor: tailwindConfig().theme.colors.blue[500],
          barPercentage: 0.66,
          categoryPercentage: 0.66,
        },
      ],
    };

    setChartData(data);
  }, [revenueByCategory]);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-card shadow-lg rounded-xl">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-primary">Chiffre d&apos;affaire par Category</h2>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      <BarChart data={chartData} width={595} height={448} />
    </div>
  );
}

export default DashboardCard09;
