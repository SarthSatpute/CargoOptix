"use client"
import { useStore } from "@/lib/store"
import GMGauge from "./GMGauge"
import PlacementStats from "./PlacementStats"
import CargoPieChart from "./CargoPieChart"

export default function RightPanel() {
  const { metrics, placedContainers } = useStore()

  if (!metrics) {
    return (
      <div className="w-96 bg-slate-900 border-l border-slate-700 p-6 flex items-center justify-center">
        <p className="text-slate-400">Run optimization to see metrics</p>
      </div>
    )
  }

  return (
    <div className="w-96 bg-slate-900 border-l border-slate-700 overflow-y-auto flex flex-col">
      {/* GM Gauge */}
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">Stability</h2>
        <GMGauge gm={metrics.gm} gmMin={1.0} isStable={metrics.is_stable} />
      </div>

      {/* Key Metrics */}
      <div className="p-4 border-b border-slate-700 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">KG (Center of Gravity)</span>
          <span className="font-semibold text-cyan-400">{metrics.kg.toFixed(3)} m</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Total Weight</span>
          <span className="font-semibold text-cyan-400">{(metrics.total_weight / 1000).toFixed(1)} kt</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Placement Rate</span>
          <span className="font-semibold text-cyan-400">{metrics.placement_rate.toFixed(1)}%</span>
        </div>
      </div>

      {/* Placement Stats */}
      <div className="p-4 border-b border-slate-700">
        <PlacementStats metrics={metrics} />
      </div>

      {/* Cargo Distribution */}
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">Cargo Distribution</h2>
        <CargoPieChart distribution={metrics.cargo_distribution} />
      </div>

      {/* Failed Containers Info */}
      {metrics.failed_count > 0 && (
        <div className="p-4 bg-red-900/20 border-t border-red-700/50">
          <h3 className="text-sm font-semibold text-red-400 mb-2">⚠️ Failed Placements</h3>
          <p className="text-xs text-red-300">{metrics.failed_count} containers could not be placed</p>
        </div>
      )}
    </div>
  )
}
