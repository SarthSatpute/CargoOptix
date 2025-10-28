"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ScenarioModal from "@/components/ScenarioModal"

export default function ScenariosPage() {
  const { setCurrentScenario } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const mockScenarios = [
    {
      id: 1,
      name: "Scenario 1",
      containers: 450,
      teu: 650,
      sea_state: "Calm",
      utilization: 92,
    },
    {
      id: 2,
      name: "Scenario 2",
      containers: 380,
      teu: 520,
      sea_state: "Moderate",
      utilization: 85,
    },
    {
      id: 3,
      name: "Scenario 3",
      containers: 520,
      teu: 780,
      sea_state: "Rough",
      utilization: 88,
    },
  ]

  const containerVariants = {
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
          Scenarios
        </motion.h1>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Button onClick={() => setIsModalOpen(true)} className="bg-cyan-500 hover:bg-cyan-600 text-slate-950">
            Add Scenario
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockScenarios.map((scenario, i) => (
          <motion.div
            key={scenario.id}
            custom={i}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05, borderColor: "#00c2c7" }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className="bg-slate-900 border-cyan-500/30 hover:border-cyan-500 cursor-pointer transition-all p-4"
              onClick={() => setCurrentScenario(scenario as any)}
            >
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">{scenario.name}</h3>
              <div className="space-y-2 text-sm text-slate-300">
                <p>Containers: {scenario.containers}</p>
                <p>TEU: {scenario.teu}</p>
                <p>Sea State: {scenario.sea_state}</p>
                <p className="text-amber-400">Utilization: {scenario.utilization}%</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <ScenarioModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </motion.div>
  )
}
