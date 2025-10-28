"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"
import LeftPanel from "@/components/LeftPanel"
import ThreeCanvas from "@/components/ThreeCanvas"
import RightPanel from "@/components/RightPanel"
import { useDemoMode } from "@/hooks/useDemoMode"
// import { usePlayback } from "@/hooks/usePlayback"  // ❌ DISABLE THIS
import { useStore } from "@/lib/store"

function DashboardContent() {
  const { placedContainers } = useStore()

  useDemoMode()
  // usePlayback(placedContainers)  // ❌ COMMENT THIS OUT

  return (
    <motion.div
      className="flex flex-1 overflow-hidden gap-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <LeftPanel />
      <ThreeCanvas />
      <RightPanel />
    </motion.div>
  )
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Loading visualization...</div>}>
      <DashboardContent />
    </Suspense>
  )
}