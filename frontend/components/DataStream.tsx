"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const dataPoints = [
  "SHIP_ID: CX-2847",
  "LOAD: 2,847 TEU",
  "STABILITY: 1.27m",
  "DRAFT: 8.4m",
  "TRIM: 0.2m",
  "COORD: 35.6762°N",
  "COORD: 139.6503°E",
  "WEIGHT: 28,450t",
  "UTILIZATION: 94.2%",
  "STATUS: OPTIMIZED",
]

export function DataStream() {
  const [windowHeight, setWindowHeight] = useState(1000) // fallback default

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowHeight(window.innerHeight)
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Left side data stream */}
      <div className="absolute left-0 top-0 w-64 h-full flex flex-col gap-4 p-4">
        {dataPoints.map((point, idx) => (
          <motion.div
            key={`left-${idx}`}
            className="text-xs font-mono text-cyan-400/60 whitespace-nowrap"
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -windowHeight, opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 15,
              delay: idx * 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            {point}
          </motion.div>
        ))}
      </div>

      {/* Right side data stream */}
      <div className="absolute right-0 top-0 w-64 h-full flex flex-col gap-4 p-4">
        {dataPoints.map((point, idx) => (
          <motion.div
            key={`right-${idx}`}
            className="text-xs font-mono text-cyan-400/40 whitespace-nowrap text-right"
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -windowHeight, opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 15,
              delay: idx * 1.5 + 7.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            {point}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
