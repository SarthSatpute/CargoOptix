"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { SoundToggle } from "@/components/SoundToggle"
import { RadarRings } from "@/components/RadarRings"
import { DataStream } from "@/components/DataStream"
import { HolographicShip } from "@/components/HolographicShip"
import { AIAssistantPanel } from "@/components/AIAssistantPanel"
import { MessageCircle } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isAIOpen, setIsAIOpen] = useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  const handleLaunch = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      router.push("/dashboard")
    }, 600)
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 overflow-hidden flex flex-col items-center justify-center text-white">
      <SoundToggle />

      <DataStream />

      <motion.div
        className="absolute inset-0 flex items-center justify-center z-5"
        initial={{ opacity: 0 }}
        animate={isReady ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
      >
        <RadarRings />
      </motion.div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center z-5"
        initial={{ opacity: 0 }}
        animate={isReady ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
      >
        <HolographicShip />
      </motion.div>

      <motion.div
        className="relative z-10 text-center max-w-3xl px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={isReady && !isTransitioning ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div className="relative mb-8">
          <motion.div
            className="absolute inset-0 text-7xl md:text-8xl font-bold text-transparent"
            style={{
              backgroundImage: "linear-gradient(135deg, #00334D 0%, #001A33 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "blur(20px)",
              opacity: 0.35,
            }}
            animate={{ opacity: [0.3, 0.4, 0.3] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          >
            CargoOptix
          </motion.div>

          <motion.h1
            className="text-7xl md:text-8xl font-bold text-transparent bg-clip-text"
            style={{
              backgroundImage: "linear-gradient(135deg, #00E0FF 0%, #00B8E6 100%)",
              textShadow: "0 0 20px rgba(0, 224, 255, 0.5), inset 0 0 20px rgba(0, 224, 255, 0.3)",
              filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5))",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={isReady && !isTransitioning ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            CargoOptix
          </motion.h1>

          <motion.h1
            className="absolute inset-0 text-7xl md:text-8xl font-bold"
            style={{
              color: "rgba(0, 224, 255, 0.2)",
            }}
            animate={{
              x: [0, -2, 2, -1, 0],
              opacity: [0, 0.5, 0.3, 0.5, 0],
            }}
            transition={{
              duration: 0.4,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 3,
            }}
          >
            CargoOptix
          </motion.h1>

          <motion.div
            className="absolute inset-0 text-7xl md:text-8xl font-bold text-transparent bg-clip-text"
            style={{
              backgroundImage: "linear-gradient(90deg, transparent 0%, rgba(0, 224, 255, 0.4) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
            }}
            animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            CargoOptix
          </motion.div>
        </motion.div>

        <motion.p
          className="text-2xl md:text-3xl mb-4 font-light tracking-wide"
          style={{ color: "#7AEFFF" }}
          initial={{ opacity: 0, y: 20 }}
          animate={isReady && !isTransitioning ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Intelligent Ship Load Optimization
        </motion.p>

        <motion.p
          className="text-lg md:text-xl text-slate-400 mb-12 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={isReady && !isTransitioning ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Powered by Maritime Intelligence
        </motion.p>

        <motion.button
          onClick={handleLaunch}
          className="relative px-10 py-4 text-lg font-semibold text-slate-950 rounded-lg overflow-hidden group"
          style={{
            background: "linear-gradient(135deg, #00B3C6 0%, #0099B3 100%)",
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isReady && !isTransitioning ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute inset-0 rounded-lg blur-lg opacity-0 group-hover:opacity-100"
            style={{
              background: "linear-gradient(135deg, #00B3C6 0%, #0099B3 100%)",
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
          <span className="relative">Launch Optimization</span>
        </motion.button>
      </motion.div>

      <motion.button
        onClick={() => setIsAIOpen(true)}
        className="absolute top-6 right-6 z-20 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 border border-cyan-500/50 flex items-center justify-center hover:border-cyan-400 transition-colors group"
        initial={{ opacity: 0, scale: 0 }}
        animate={isReady ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
          <MessageCircle className="w-6 h-6 text-cyan-400" />
        </motion.div>
      </motion.button>

      <AIAssistantPanel isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

      {/* Version Tag - Bottom Right */}
      <motion.div
        className="absolute bottom-6 right-6 text-xs text-slate-500 font-mono"
        initial={{ opacity: 0 }}
        animate={isReady ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        v2.0
      </motion.div>

      {/* Copyright - Bottom Left */}
      <motion.div
        className="absolute bottom-6 left-6 text-xs text-slate-500"
        initial={{ opacity: 0 }}
        animate={isReady ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        © CargoOptix Maritime Intelligence
      </motion.div>
    </div>
  )
}
