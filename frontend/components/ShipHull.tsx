"use client"
import * as THREE from "three"

export default function ShipHull() {
  // Simple stylized ship hull geometry
  const hullGeometry = new THREE.BoxGeometry(60, 8, 15)
  const hullMaterial = new THREE.MeshStandardMaterial({
    color: 0x0b3d91,
    metalness: 0.3,
    roughness: 0.7,
    transparent: true,
    opacity: 0.8,
  })

  return (
    <group>
      {/* Main Hull */}
      <mesh geometry={hullGeometry} material={hullMaterial} position={[0, 0, 0]} castShadow receiveShadow />

      {/* Deck */}
      <mesh position={[0, 4, 0]} castShadow receiveShadow>
        <boxGeometry args={[60, 0.5, 15]} />
        <meshStandardMaterial color={0x1f2937} metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Cabin (simplified) */}
      <mesh position={[20, 8, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 6, 8]} />
        <meshStandardMaterial color={0x374151} metalness={0.1} roughness={0.9} />
      </mesh>
    </group>
  )
}
