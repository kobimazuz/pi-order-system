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

interface SalesChartProps {
  data: {
    total: number
    average: number
    max: number
    min: number
    previousPeriod: {
      total: number
      average: number
      max: number
      min: number
    }
  }
  type: "bar" | "line" | "pie"
}

export function SalesChart({ data, type }: SalesChartProps) {
  const chartData = {
    labels: ["סה״כ", "ממוצע", "מקסימום", "מינימום"],
    datasets: [
      {
        label: "תקופה נוכחית",
        data: [data.total, data.average, data.max, data.min],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1
      },
      {
        label: "תקופה קודמת",
        data: [
          data.previousPeriod.total,
          data.previousPeriod.average,
          data.previousPeriod.max,
          data.previousPeriod.min
        ],
        backgroundColor: "rgba(99, 102, 241, 0.5)",
        borderColor: "rgb(99, 102, 241)",
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

