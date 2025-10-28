"use client"

interface Metrics {
  placed_count: number
  total_count: number
  failed_count: number
  slot_utilization: number
}

export default function PlacementStats({ metrics }: { metrics: Metrics }) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-slate-300">Placement Summary</h2>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-400">Containers Placed</span>
          <span className="text-cyan-400 font-semibold">
            {metrics.placed_count} / {metrics.total_count}
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-cyan-500 h-2 rounded-full transition-all"
            style={{ width: `${(metrics.placed_count / metrics.total_count) * 100}%` }}
          />
        </div>
      </div>

      {/* Slot Utilization */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-400">Slot Utilization</span>
          <span className="text-cyan-400 font-semibold">{metrics.slot_utilization.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-teal-500 h-2 rounded-full transition-all"
            style={{ width: `${metrics.slot_utilization}%` }}
          />
        </div>
      </div>

      {/* Failed Count */}
      {metrics.failed_count > 0 && (
        <div className="text-xs">
          <span className="text-slate-400">Failed: </span>
          <span className="text-red-400 font-semibold">{metrics.failed_count}</span>
        </div>
      )}
    </div>
  )
}
