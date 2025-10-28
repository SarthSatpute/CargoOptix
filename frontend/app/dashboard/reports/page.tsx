"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Download, FileJson } from "lucide-react"

const utilizationData = [
  { name: "Scenario 1", utilization: 92 },
  { name: "Scenario 2", utilization: 85 },
  { name: "Scenario 3", utilization: 88 },
  { name: "Scenario 4", utilization: 91 },
]

const gmVariationData = [
  { name: "Jan", gm: 2.1 },
  { name: "Feb", gm: 2.3 },
  { name: "Mar", gm: 2.0 },
  { name: "Apr", gm: 2.4 },
  { name: "May", gm: 2.2 },
]

const cargoDistribution = [
  { name: "General", value: 60 },
  { name: "Reefer", value: 25 },
  { name: "Hazmat", value: 15 },
]

const COLORS = ["#00c2c7", "#fbbf24", "#ef4444"]

export default function ReportsPage() {
  const handleExportPDF = () => {
    alert("PDF export functionality would be implemented here")
  }

  const handleExportCSV = () => {
    alert("CSV export functionality would be implemented here")
  }

  const handleViewJSON = () => {
    alert("JSON view would be displayed here")
  }

  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  }

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <motion.h1
          className="text-3xl font-bold text-cyan-400"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          Reports
        </motion.h1>
        <motion.div
          className="flex gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button onClick={handleExportPDF} className="bg-amber-500 hover:bg-amber-600 text-slate-950">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={handleExportCSV} className="bg-amber-500 hover:bg-amber-600 text-slate-950">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handleViewJSON} className="bg-cyan-500 hover:bg-cyan-600 text-slate-950">
            <FileJson className="w-4 h-4 mr-2" />
            View JSON
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Slot Utilization */}
        <motion.div custom={0} variants={chartVariants} initial="hidden" animate="visible">
          <Card className="bg-slate-900 border-cyan-500/30 p-4">
            <h2 className="text-lg font-semibold text-cyan-400 mb-4">Slot Utilization</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={utilizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #00c2c7",
                  }}
                />
                <Bar dataKey="utilization" fill="#00c2c7" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* GM Variation */}
        <motion.div custom={1} variants={chartVariants} initial="hidden" animate="visible">
          <Card className="bg-slate-900 border-cyan-500/30 p-4">
            <h2 className="text-lg font-semibold text-cyan-400 mb-4">GM Variation Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={gmVariationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #00c2c7",
                  }}
                />
                <Line type="monotone" dataKey="gm" stroke="#fbbf24" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Cargo Distribution */}
        <motion.div custom={2} variants={chartVariants} initial="hidden" animate="visible">
          <Card className="bg-slate-900 border-cyan-500/30 p-4">
            <h2 className="text-lg font-semibold text-cyan-400 mb-4">Cargo Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cargoDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {cargoDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #00c2c7",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Summary Stats */}
        <motion.div custom={3} variants={chartVariants} initial="hidden" animate="visible">
          <Card className="bg-slate-900 border-cyan-500/30 p-4">
            <h2 className="text-lg font-semibold text-cyan-400 mb-4">Summary Statistics</h2>
            <div className="space-y-3">
              <motion.div
                className="flex justify-between"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-slate-300">Average Utilization:</span>
                <span className="text-cyan-400 font-semibold">89%</span>
              </motion.div>
              <motion.div
                className="flex justify-between"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-slate-300">Total Optimizations:</span>
                <span className="text-cyan-400 font-semibold">1,247</span>
              </motion.div>
              <motion.div
                className="flex justify-between"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-slate-300">Avg Containers Placed:</span>
                <span className="text-cyan-400 font-semibold">438</span>
              </motion.div>
              <motion.div
                className="flex justify-between"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-slate-300">Success Rate:</span>
                <span className="text-amber-400 font-semibold">94.2%</span>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
