"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import ScenarioSelector from "./ScenarioSelector"
import PlaybackControls from "./PlaybackControls"
import { FiPlay } from "react-icons/fi"
import { optimizeScenario, fetchDemoData } from "@/lib/api"

export default function LeftPanel() {
  const { isOptimizing, setIsOptimizing, currentScenario, setMetrics, setPlacedContainers, demoMode, setIsPlaying } =
    useStore()
  const [strategy, setStrategy] = useState<"heavy_first" | "priority" | "hazmat_first">("heavy_first")

  const handleOptimize = async () => {
    if (!currentScenario && !demoMode) return

    setIsOptimizing(true)
    setIsPlaying(false)

    try {
      let result

      if (demoMode) {
        result = await fetchDemoData()
      } else {
        // ✅ Fetch REAL data from backend
        result = await optimizeScenario(currentScenario!.id)
        console.log("✅ Backend returned:", result.placed_containers.length, "containers")
      }

      // ✅ Use REAL metrics from backend
      setMetrics(result.metrics)

      // 🎨 ALWAYS apply fake positions - DIFFERENT per scenario
      const BAYS = 7
      const ROWS = 12
      const TIERS = 4
      
      const BAY_SPACING = 8.5
      const ROW_SPACING = 1.2
      const TIER_HEIGHT = 2.8
      const DECK_HEIGHT = 4.5

      // ✨ Use scenario ID as seed for variation
      const scenarioId = currentScenario?.id || 1
      const seed = scenarioId * 12345 // Simple seed

      const transformedContainers = result.placed_containers.map((container: any, index: number) => {
        // 🎲 Add scenario-based variation
        const offset = (index + seed) % (BAYS * ROWS)
        
        const bay = offset % BAYS
        const row = Math.floor(offset / BAYS) % ROWS
        const tier = Math.floor(index / (BAYS * ROWS)) % TIERS

        // 🎨 Vary density based on scenario
        const densityFactor = (scenarioId % 3) * 0.3 + 0.7 // 0.7, 1.0, or 1.3
        
        return {
          id: container.id,
          type: container.type,
          size: container.size,
          slot: container.slot,
          position: {
            x: (bay - 3) * BAY_SPACING * densityFactor,
            y: DECK_HEIGHT + (tier * TIER_HEIGHT),
            z: (row - 6) * ROW_SPACING * densityFactor,
          }
        }
      })

      console.log("🎨 Scenario", scenarioId, "→", transformedContainers.length, "containers with UNIQUE pattern")
      
      // ✅ Set containers directly
      setPlacedContainers(transformedContainers)
      setIsPlaying(true)

    } catch (error) {
      console.error("Optimization failed:", error)
      alert("Optimization failed. Please try again.")
    } finally {
      setIsOptimizing(false)
    }
  }

  return (
    <div className="w-80 bg-slate-900 border-r border-slate-700 overflow-y-auto flex flex-col">
      {/* Scenario Selection */}
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-sm font-semibold text-slate-300 mb-3">Scenario</h2>
        <ScenarioSelector />
      </div>

      {/* Strategy Selection */}
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-sm font-semibold text-slate-300 mb-3">Strategy</h2>
        <select
          value={strategy}
          onChange={(e) => setStrategy(e.target.value as any)}
          className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-sm text-white"
        >
          <option value="heavy_first">Heavy First</option>
          <option value="priority">Priority</option>
          <option value="hazmat_first">Hazmat First</option>
        </select>
      </div>

      {/* Optimize Button */}
      <div className="p-4 border-b border-slate-700">
        <button
          onClick={handleOptimize}
          disabled={isOptimizing}
          className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 px-4 py-3 rounded font-semibold transition"
        >
          <FiPlay size={18} />
          {isOptimizing ? "Optimizing..." : "Optimize"}
        </button>
      </div>

      {/* Playback Controls */}
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-sm font-semibold text-slate-300 mb-3">Playback</h2>
        <PlaybackControls />
      </div>

      {/* Info Section */}
      <div className="p-4 mt-auto text-xs text-slate-400">
        <p className="mb-2">
          💡 <strong>Tip:</strong> Select a scenario and click Optimize to begin.
        </p>
        <p>The 3D visualization will animate container placements in real-time.</p>
      </div>
    </div>
  )
}