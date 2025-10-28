"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export function ShipHeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight * 0.6
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    let animationId: number
    let time = 0

    const drawShip = (x: number, y: number, scale: number, tilt: number) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(tilt)
      ctx.scale(scale, scale)

      // Ship hull
      ctx.fillStyle = "rgba(0, 194, 199, 0.3)"
      ctx.beginPath()
      ctx.moveTo(-40, 0)
      ctx.lineTo(-30, -15)
      ctx.lineTo(30, -15)
      ctx.lineTo(40, 0)
      ctx.lineTo(30, 15)
      ctx.lineTo(-30, 15)
      ctx.closePath()
      ctx.fill()

      // Ship hull glow
      ctx.strokeStyle = "rgba(0, 194, 199, 0.6)"
      ctx.lineWidth = 2
      ctx.stroke()

      // Containers on ship
      const containerColors = ["rgba(0, 194, 199, 0.4)", "rgba(251, 191, 36, 0.3)", "rgba(0, 194, 199, 0.35)"]

      for (let i = 0; i < 3; i++) {
        const containerX = -25 + i * 25
        ctx.fillStyle = containerColors[i]
        ctx.fillRect(containerX - 8, -8, 16, 16)

        // Container glow pulse
        ctx.strokeStyle = containerColors[i].replace("0.", "0.7")
        ctx.lineWidth = 1.5
        ctx.strokeRect(containerX - 8, -8, 16, 16)
      }

      ctx.restore()
    }

    const drawOceanGrid = (offsetY: number) => {
      const gridSize = 40
      const gridColor = "rgba(0, 194, 199, 0.08)"
      const gridColorBright = "rgba(0, 194, 199, 0.15)"

      ctx.strokeStyle = gridColor
      ctx.lineWidth = 0.5

      // Vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Horizontal lines with wave effect
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        for (let x = 0; x < canvas.width; x += 5) {
          const waveOffset = Math.sin((x + offsetY) * 0.01) * 3
          const yPos = y + waveOffset + offsetY * 0.1
          if (x === 0) {
            ctx.moveTo(x, yPos)
          } else {
            ctx.lineTo(x, yPos)
          }
        }
        ctx.stroke()
      }

      // Horizon line with glow
      const horizonY = canvas.height * 0.4
      ctx.strokeStyle = gridColorBright
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, horizonY)
      ctx.lineTo(canvas.width, horizonY)
      ctx.stroke()
    }

    const animate = () => {
      // Clear canvas with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "rgba(15, 23, 42, 0.8)")
      gradient.addColorStop(0.5, "rgba(15, 23, 42, 0.6)")
      gradient.addColorStop(1, "rgba(0, 194, 199, 0.05)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw ocean grid
      drawOceanGrid(time * 0.5)

      // Ship position and animation
      const shipX = canvas.width / 2 + Math.sin(time * 0.0005) * 100
      const shipY = canvas.height * 0.4 + Math.sin(time * 0.0008) * 8
      const shipTilt = Math.sin(time * 0.0008) * 0.05
      const shipScale = 1 + Math.sin(time * 0.0006) * 0.1

      drawShip(shipX, shipY, shipScale, shipTilt)

      // Parallax depth effect - draw distant ships
      ctx.globalAlpha = 0.15
      drawShip(canvas.width * 0.2, canvas.height * 0.25, 0.5, 0)
      drawShip(canvas.width * 0.8, canvas.height * 0.3, 0.6, 0)
      ctx.globalAlpha = 1

      time++
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if hovering near ship (center area)
    const shipX = canvas.width / 2
    const shipY = canvas.height * 0.4
    const distance = Math.sqrt((x - shipX) ** 2 + (y - shipY) ** 2)

    if (distance < 80) {
      setShowTooltip(true)
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    } else {
      setShowTooltip(false)
    }
  }

  return (
    <div className="relative w-full h-[60vh] overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={() => setShowTooltip(false)}
      />

      {showTooltip && (
        <motion.div
          className="absolute bg-slate-900 border border-cyan-400/50 rounded px-3 py-2 text-sm text-cyan-300 pointer-events-none"
          style={{
            left: `${tooltipPos.x + 10}px`,
            top: `${tooltipPos.y - 40}px`,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <div className="font-mono text-xs">Stability within limits</div>
          <div className="font-mono text-xs">GM: 1.27m ✅</div>
        </motion.div>
      )}
    </div>
  )
}
