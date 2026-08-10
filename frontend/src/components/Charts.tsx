import React from 'react'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend)

export function BarChart({ labels, data }: { labels: string[]; data: number[] }){
  return <Bar data={{ labels, datasets: [{ label: 'Consumo', data, backgroundColor: '#0ea5e9' }]}} />
}

export function DonutChart({ labels, data }: { labels: string[]; data: number[] }){
  return <Doughnut data={{ labels, datasets: [{ data, backgroundColor: ['#0ea5e9','#f97316','#10b981'] }]}} />
}

export function LineChart({ labels, data }: { labels: string[]; data: number[] }){
  return <Line data={{ labels, datasets: [{ label: 'Pulsos', data, borderColor: '#6366f1', tension: 0.2 }]}} />
}
