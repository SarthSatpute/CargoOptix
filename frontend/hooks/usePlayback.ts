"use client"

import { useEffect, useRef } from "react"
import { useStore } from "@/lib/store"

export function usePlayback(containers: any[]) {
  const { isPlaying, playbackSpeed, setPlacedContainers } = useStore()
  const currentIndexRef = useRef(0)
  const animationFrameRef = useRef<number>()
  const lastTimeRef = useRef(Date.now())

  useEffect(() => {
    if (!isPlaying || !containers || containers.length === 0) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      return
    }

    const animate = () => {
      const now = Date.now()
      const deltaTime = (now - lastTimeRef.current) / 1000 // Convert to seconds
      lastTimeRef.current = now

      // Calculate how many containers to add based on playback speed
      const containersPerSecond = 10 * playbackSpeed
      const containersToAdd = Math.floor(deltaTime * containersPerSecond)

      if (containersToAdd > 0) {
        const newIndex = Math.min(currentIndexRef.current + containersToAdd, containers.length)
        setPlacedContainers(containers.slice(0, newIndex))
        currentIndexRef.current = newIndex

        if (newIndex >= containers.length) {
          // Animation complete
          return
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isPlaying, playbackSpeed, containers, setPlacedContainers])

  // Reset playback when containers change
  useEffect(() => {
    currentIndexRef.current = 0
    lastTimeRef.current = Date.now()
  }, [containers])
}
