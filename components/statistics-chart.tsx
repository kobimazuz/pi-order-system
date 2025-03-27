"use client"

import { Bar, Line, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface StatisticsChartProps {
  data: {
    total: number
    lowStock: number
    outOfStock: number
  }
  type: "bar" | "line" | "pie"
}

export function StatisticsChart({ data, type }: StatisticsChartProps) {
  const normalStock = data.total - data.lowStock - data.outOfStock

  const chartData = {
    labels: ["מלאי תקין", "מלאי נמוך", "אזל מהמלאי"],
    datasets: [
      {
        label: "מצב מלאי",
        data: [normalStock, data.lowStock, data.outOfStock],
        backgroundColor: [
          "rgba(34, 197, 94, 0.5)",
          "rgba(234, 179, 8, 0.5)",
          "rgba(239, 68, 68, 0.5)"
        ],
        borderColor: [
          "rgb(34, 197, 94)",
          "rgb(234, 179, 8)",
          "rgb(239, 68, 68)"
        ],
        borderWidth: 1
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const
      },
      title: {
        display: false
      }
    }
  }

  if (type === "bar") {
    return <Bar data={chartData} options={options} />
  }

  if (type === "line") {
    return <Line data={chartData} options={options} />
  }

  return <Pie data={chartData} options={options} />
}

