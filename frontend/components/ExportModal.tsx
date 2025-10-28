"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { FiX, FiDownload, FiCopy, FiCheck } from "react-icons/fi"

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const { metrics, placedContainers } = useStore()
  const [copied, setCopied] = useState(false)
  const [exportFormat, setExportFormat] = useState<"json" | "csv">("json")

  if (!isOpen || !metrics) return null

  const exportData = {
    metrics,
    containers: placedContainers,
    timestamp: new Date().toISOString(),
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `cargo-optix-export-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">Export Results</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded transition">
            <FiX size={20} />
          </button>
        </div>

        {/* Format Selection */}
        <div className="mb-4">
          <label className="text-sm text-slate-300 block mb-2">Format</label>
          <div className="flex gap-2">
            {(["json", "csv"] as const).map((format) => (
              <button
                key={format}
                onClick={() => setExportFormat(format)}
                className={`flex-1 py-2 rounded text-sm transition ${
                  exportFormat === format ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="mb-4 p-3 bg-slate-800 rounded text-xs text-slate-300 max-h-32 overflow-y-auto font-mono">
          {JSON.stringify(exportData, null, 2).slice(0, 200)}...
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded transition"
          >
            {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded transition"
          >
            <FiDownload size={16} />
            Download
          </button>
        </div>
      </div>
    </div>
  )
}
