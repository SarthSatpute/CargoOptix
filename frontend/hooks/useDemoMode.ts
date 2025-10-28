"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"
import { fetchDemoData } from "@/lib/api"

export function useDemoMode() {
  const { demoMode, setMetrics, setPlacedContainers, setIsPlaying } = useStore()

  useEffect(() => {
    if (!demoMode) return

    const runDemo = async () => {
      try {
        const data = await fetchDemoData()
        setMetrics(data.metrics)
        setPlacedContainers([])

        // Start playback after a short delay
        setTimeout(() => {
          setPlacedContainers(data.placed)
          setIsPlaying(true)
        }, 500)
      } catch (error) {
        console.error("Demo mode error:", error)
      }
    }

    runDemo()
  }, [demoMode, setMetrics, setPlacedContainers, setIsPlaying])
}
