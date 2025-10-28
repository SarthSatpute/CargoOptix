"use client"

interface GMGaugeProps {
  gm: number
  gmMin: number
  isStable: boolean
}

export default function GMGauge({ gm, gmMin, isStable }: GMGaugeProps) {
  // Determine color based on stability
  const getColor = () => {
    if (!isStable) return "#FF4D4F" // Red - Unsafe
    if (gm < gmMin + 0.5) return "#FFB020" // Amber - Marginal
    return "#10B981" // Green - Safe
  }

  const percentage = Math.min((gm / (gmMin + 2)) * 100, 100)

  return (
    <div className="flex flex-col items-center">
      {/* Circular Gauge */}
      <svg width="120" height="120" viewBox="0 0 120 120" className="mb-4">
        {/* Background circle */}
        <circle cx="60" cy="60" r="50" fill="none" stroke="#374151" strokeWidth="8" />

        {/* Colored arc */}
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke={getColor()}
          strokeWidth="8"
          strokeDasharray={`${(percentage / 100) * 314} 314`}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />

        {/* Center text */}
        <text x="60" y="65" textAnchor="middle" className="text-lg font-bold fill-white">
          {gm.toFixed(2)}
        </text>
        <text x="60" y="80" textAnchor="middle" className="text-xs fill-slate-400">
          m
        </text>
      </svg>

      {/* Status */}
      <div className="text-center">
        <p className="text-xs text-slate-400">GM (Metacentric Height)</p>
        <p className={`text-sm font-semibold ${isStable ? "text-green-400" : "text-red-400"}`}>
          {isStable ? "✓ Stable" : "✗ Unstable"}
        </p>
        <p className="text-xs text-slate-500 mt-1">Min: {gmMin.toFixed(2)} m</p>
      </div>
    </div>
  )
}
