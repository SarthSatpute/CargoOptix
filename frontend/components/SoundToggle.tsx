"use client"

import { useRef } from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Volume2, VolumeX } from "lucide-react"

export function SoundToggle() {
  const [isMuted, setIsMuted] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(() => {
          // Autoplay might be blocked by browser
          setIsMuted(true)
        })
      }
    }
  }, [isMuted])

  return (
    <>
      <audio
        ref={audioRef}
        loop
        volume={0.3}
        src="data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=="
      />

      <motion.button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-6 right-6 z-20 p-3 rounded-full bg-slate-900/50 border border-cyan-400/30 hover:border-cyan-400/60 text-cyan-400 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title={isMuted ? "Unmute ambient sound" : "Mute ambient sound"}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </motion.button>
    </>
  )
}
