"use client"

import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import ShipHull from "./ShipHull"
import ContainerInstancer from "./ContainerInstancer"
import { useStore } from "@/lib/store"

export default function ShipScene() {
  const groupRef = useRef<THREE.Group>(null)
  const { placedContainers, metrics } = useStore()

  // ✅ Log when containers change
  useEffect(() => {
    console.log("🚢 ShipScene updated:", placedContainers.length, "containers")
  }, [placedContainers])

  // Subtle ship tilt based on stability
  useFrame(() => {
    if (groupRef.current && metrics) {
      const tiltAmount = ((metrics.stability_margin || 0) - 1) * 0.02
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, tiltAmount, 0.05)
    }
  })

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={0.4} />

      {/* Camera Controls */}
      <OrbitControls autoRotate={false} autoRotateSpeed={2} damping={0.05} enableZoom={true} enablePan={true} />

      {/* Scene Group */}
      <group ref={groupRef}>
        {/* Ship Hull */}
        <ShipHull />

        {/* Containers */}
        <ContainerInstancer containers={placedContainers} />

        {/* Grid Helper for reference */}
        <gridHelper args={[100, 20]} position={[0, -5, 0]} />
      </group>
    </>
  )
}