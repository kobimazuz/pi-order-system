"use client"

import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface SalesStatisticsChartProps {
  data: Array<{
    date: Date
    amount: number
  }>
  type: "line"
}

export function SalesStatisticsChart({ data, type }: SalesStatisticsChartProps) {
  const chartData: ChartData<"line"> = {
    labels: data.map(item => new Date(item.date).toLocaleDateString('he-IL')),
    datasets: [
      {
        label: "מכירות",
        data: data.map(item => item.amount),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false
      }
    ]
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: "סטטיסטיקת מכירות"
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₪${value.toLocaleString()}`
        }
      }
    }
  }

  return (
    <Line data={chartData} options={options} />
  )
} 