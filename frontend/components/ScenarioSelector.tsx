"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import { fetchScenarios } from "@/lib/api"

interface Scenario {
  id: number
  containers: number
  teu: number
  sea_state: string
  utilization: number
}

export default function ScenarioSelector() {
  const { currentScenario, setCurrentScenario } = useStore()
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadScenarios = async () => {
      try {
        const data = await fetchScenarios()
        setScenarios(data)
        if (data.length > 0 && !currentScenario) {
          setCurrentScenario(data[0])
        }
        setError(null)
      } catch (error) {
        console.error("Failed to load scenarios:", error)
        setError("Failed to load scenarios. Using demo data.")
      } finally {
        setLoading(false)
      }
    }

    loadScenarios()
  }, [currentScenario, setCurrentScenario])

  if (loading) return <div className="text-sm text-slate-400">Loading scenarios...</div>

  return (
    <div className="space-y-2">
      {error && <div className="text-xs text-amber-500 bg-amber-500/10 p-2 rounded">{error}</div>}
      {scenarios.map((scenario) => (
        <button
          key={scenario.id}
          onClick={() => setCurrentScenario(scenario)}
          className={`w-full text-left p-3 rounded border transition ${
            currentScenario?.id === scenario.id
              ? "bg-cyan-600/20 border-cyan-500"
              : "bg-slate-800 border-slate-600 hover:border-slate-500"
          }`}
        >
          <div className="flex justify-between items-start mb-1">
            <span className="font-semibold text-sm">Scenario {scenario.id}</span>
            <span className="text-xs bg-slate-700 px-2 py-1 rounded">{scenario.teu} TEU</span>
          </div>
          <div className="text-xs text-slate-400 space-y-1">
            <p>Containers: {scenario.containers}</p>
            <p>Sea State: {scenario.sea_state}</p>
            <p>Utilization: {(scenario.utilization * 100).toFixed(1)}%</p>
          </div>
        </button>
      ))}
    </div>
  )
}
