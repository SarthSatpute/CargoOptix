"use client"
import { useStore } from "@/lib/store"
import { FiPlay, FiPause, FiSkipBack } from "react-icons/fi"

export default function PlaybackControls() {
  const { isPlaying, setIsPlaying, playbackSpeed, setPlaybackSpeed } = useStore()

  return (
    <div className="space-y-3">
      {/* Play/Pause Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded transition"
        >
          {isPlaying ? <FiPause size={16} /> : <FiPlay size={16} />}
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded transition">
          <FiSkipBack size={16} />
          Step
        </button>
      </div>

      {/* Speed Control */}
      <div>
        <label className="text-xs text-slate-400 block mb-2">Speed: {playbackSpeed.toFixed(2)}x</label>
        <input
          type="range"
          min="0.25"
          max="2"
          step="0.25"
          value={playbackSpeed}
          onChange={(e) => setPlaybackSpeed(Number.parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  )
}
