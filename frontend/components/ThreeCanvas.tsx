"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import ShipScene from "./ShipScene"

export default function ThreeCanvas() {
  return (
    <div className="flex-1 bg-gradient-to-b from-slate-900 to-slate-950 relative">
      <Canvas camera={{ position: [0, 15, 30], fov: 50 }} dpr={[1, 2]} performance={{ min: 0.5 }}>
        <Suspense fallback={null}>
          <ShipScene />
        </Suspense>
      </Canvas>

      {/* Loading Overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="text-white text-sm opacity-50">3D Visualization</div>
      </div>
    </div>
  )
}
