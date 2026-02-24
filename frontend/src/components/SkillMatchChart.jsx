import { Radar } from "react-chartjs-2";
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Tooltip, Legend);

function SkillMatchChart({ skills }) {
  const labels = skills.map(s => s.name);
  const values = skills.map(s => s.value);

  const data = {
    labels,
    datasets: [{
      label: 'Skill Match (%)',
      data: values,
      backgroundColor: 'rgba(44, 182, 125, 0.4)',
      borderColor: '#2cb67d',
      borderWidth: 2,
      pointBackgroundColor: "#9b34ef",
    }],
  };

  const options = {
    scales: {
      r: {
        angleLines: { display: false },
        suggestedMin: 0,
        suggestedMax: 100
      }
    }
  };

  return (
    <div className="chart-container">
      <Radar data={data} options={options} />
    </div>
  );
}

export default SkillMatchChart;
