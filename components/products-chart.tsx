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

interface ProductsChartProps {
  data: {
    total: number
    active: number
    categories: {
      name: string
      count: number
    }[]
  }
  type: "bar" | "line" | "pie"
}

export function ProductsChart({ data, type }: ProductsChartProps) {
  const chartData = {
    labels: data.categories.map(category => category.name),
    datasets: [
      {
        label: "מספר מוצרים",
        data: data.categories.map(category => category.count),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
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

