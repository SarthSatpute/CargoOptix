"use client"

import { motion } from "framer-motion"

export function HolographicShip() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Holographic glow effect */}
      <motion.div
        className="absolute w-64 h-40 bg-gradient-to-r from-cyan-500/20 via-cyan-400/10 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
      />

      {/* Ship silhouette with holographic effect */}
      <motion.svg
        viewBox="0 0 200 120"
        className="w-80 h-48 relative z-10"
        animate={{ rotateY: [0, 5, 0, -5, 0] }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
      >
        {/* Hull */}
        <motion.path
          d="M 30 80 L 50 40 L 150 40 L 170 80 Z"
          fill="none"
          stroke="url(#shipGradient)"
          strokeWidth="2"
          animate={{
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        />

        {/* Containers */}
        {[0, 1, 2].map((row) =>
          [0, 1, 2, 3].map((col) => (
            <motion.rect
              key={`container-${row}-${col}`}
              x={60 + col * 25}
              y={50 + row * 15}
              width="20"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-cyan-400"
              animate={{
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2,
                delay: (row + col) * 0.1,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          )),
        )}

        {/* Defs */}
        <defs>
          <linearGradient id="shipGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0, 194, 199, 0.8)" />
            <stop offset="100%" stopColor="rgba(0, 194, 199, 0.3)" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Scanning lines */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <div className="w-72 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
      </motion.div>
    </div>
  )
}
