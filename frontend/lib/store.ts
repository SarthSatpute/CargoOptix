import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Metrics {
  placement_rate: number
  placed_count: number
  total_count: number
  failed_count: number
  slot_utilization: number
  total_teu: number
  total_weight: number
  kg: number
  gm: number
  is_stable: boolean
  stability_margin: number
  cargo_distribution: {
    general: number
    reefer: number
    hazmat: number
  }
}

interface Container {
  id: string
  type: "general" | "reefer" | "hazmat"
  size: "20ft" | "40ft"
  position: { x: number; y: number; z: number }
  slot: string
}

interface Scenario {
  id: number
  containers: number
  teu: number
  sea_state: string
  utilization: number
}

interface Store {
  // Scenarios
  scenarios: Scenario[]
  currentScenario: Scenario | null
  setCurrentScenario: (scenario: Scenario) => void

  // Optimization State
  isOptimizing: boolean
  setIsOptimizing: (value: boolean) => void

  // Results
  metrics: Metrics | null
  setMetrics: (metrics: Metrics) => void
  placedContainers: Container[]
  setPlacedContainers: (containers: Container[]) => void

  // Playback
  isPlaying: boolean
  setIsPlaying: (value: boolean) => void
  playbackSpeed: number
  setPlaybackSpeed: (speed: number) => void

  // UI
  demoMode: boolean
  setDemoMode: (value: boolean) => void

  // Navigation
  currentPage: string
  setCurrentPage: (page: string) => void

  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      scenarios: [],
      currentScenario: null,
      setCurrentScenario: (scenario) => set({ currentScenario: scenario }),

      isOptimizing: false,
      setIsOptimizing: (value) => set({ isOptimizing: value }),

      metrics: null,
      setMetrics: (metrics) => set({ metrics }),
      placedContainers: [],
      setPlacedContainers: (containers) => set({ placedContainers: containers }),

      isPlaying: false,
      setIsPlaying: (value) => set({ isPlaying: value }),
      playbackSpeed: 1,
      setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

      demoMode: false,
      setDemoMode: (value) => set({ demoMode: value }),

      currentPage: "dashboard",
      setCurrentPage: (page) => set({ currentPage: page }),

      sidebarOpen: true,
      setSidebarOpen: (value) => set({ sidebarOpen: value }),
    }),
    {
      name: "cargo-optix-store",
    },
  ),
)
