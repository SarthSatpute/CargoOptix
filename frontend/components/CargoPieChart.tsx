"use client"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface CargoPieChartProps {
  distribution: {
    general: number
    reefer: number
    hazmat: number
  }
}

export default function CargoPieChart({ distribution }: CargoPieChartProps) {
  const data = [
    { name: "General", value: distribution.general, fill: "#3B82F6" },
    { name: "Reefer", value: distribution.reefer, fill: "#00C2C7" },
    { name: "Hazmat", value: distribution.hazmat, fill: "#FF4D4F" },
  ]

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value} containers`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
