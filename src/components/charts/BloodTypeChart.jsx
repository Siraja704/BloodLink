import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const BloodTypeChart = ({ users }) => {
  const bloodTypeCounts = users.reduce((acc, user) => {
    if (user.isDonor && user.bloodType) {
      acc[user.bloodType] = (acc[user.bloodType] || 0) + 1;
    }
    return acc;
  }, {});

  const data = {
    labels: Object.keys(bloodTypeCounts),
    datasets: [
      {
        label: "# of Donors",
        data: Object.values(bloodTypeCounts),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#C9CBCF",
          "#E7E9ED",
        ],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Donor Distribution by Blood Type",
      },
    },
  };

  return <Pie data={data} options={options} />;
};

export default BloodTypeChart;
