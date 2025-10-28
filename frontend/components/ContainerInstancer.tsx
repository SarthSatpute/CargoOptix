"use client"

import { useMemo } from "react"
import * as THREE from "three"

interface Container {
  id: string
  type: "general" | "reefer" | "hazmat"
  size: "20ft" | "40ft"
  position: { x: number; y: number; z: number }
  slot: string
}

interface Props {
  containers: Container[]
}

export default function ContainerInstancer({ containers }: Props) {
  const containerMeshes = useMemo(() => {
    return containers.map((container, i) => {
      // Color based on type
      let color: number;
      switch (container.type) {
        case "hazmat":
          color = 0xff4444; // Red
          break;
        case "reefer":
          color = 0x44ff44; // Green
          break;
        default:
          color = 0x4488ff; // Blue
      }

      // Size based on container type
      const width = 2.4;
      const height = 2.6;
      const length = container.size === "40ft" ? 12 : 6;

      return (
        <mesh
          key={container.id}
          position={[container.position.x, container.position.y, container.position.z]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[length, height, width]} />
          <meshStandardMaterial
            color={color}
            metalness={0.6}
            roughness={0.4}
            emissive={color}
            emissiveIntensity={0.1}
          />
        </mesh>
      );
    });
  }, [containers]);

  return <group>{containerMeshes}</group>;
}