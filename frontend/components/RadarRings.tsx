"use client"

import { motion } from "framer-motion"

export function RadarRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Outer radar rings */}
      {[1, 2, 3, 4].map((ring) => (
        <motion.div
          key={`ring-${ring}`}
          className="absolute border rounded-full"
          style={{
            width: `${100 + ring * 80}px`,
            height: `${100 + ring * 80}px`,
            borderColor: "rgba(0, 176, 190, 0.3)",
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3 + ring * 0.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Scanning line */}
      <motion.div
        className="absolute w-1 h-32"
        style={{
          background: "linear-gradient(to-bottom, rgba(0, 176, 190, 0.8), transparent)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        style={{ transformOrigin: "center 64px" }}
      />

      <motion.div
        className="absolute w-8 h-8 rounded-full blur-md"
        style={{
          background: "radial-gradient(circle, rgba(200, 230, 255, 0.6), rgba(100, 180, 220, 0.3))",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      />
    </div>
  )
}
