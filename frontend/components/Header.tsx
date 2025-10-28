"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { useStore } from "@/lib/store"
import { FiDownload, FiSettings } from "react-icons/fi"
import { motion } from "framer-motion"
import ExportModal from "./ExportModal"

const pageNames: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/scenarios": "Scenarios",
  "/dashboard/ai-assistant": "AI Assistant",
  "/dashboard/reports": "Reports",
  "/dashboard/settings": "Settings",
}

export default function Header() {
  const { demoMode, setDemoMode } = useStore()
  const [exportOpen, setExportOpen] = useState(false)
  const pathname = usePathname()

  const currentPageTitle = pageNames[pathname] || "Dashboard"
  const breadcrumbPath = `CargoOptix / ${currentPageTitle}`

  return (
    <>
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
        {/* Left Section - Title and Breadcrumb */}
        <motion.div
          className="flex flex-col gap-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.h1
            className="text-2xl font-bold text-cyan-400"
            key={currentPageTitle}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {currentPageTitle}
          </motion.h1>
          <motion.p
            className="text-xs text-slate-500 font-mono"
            key={breadcrumbPath}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {breadcrumbPath}
          </motion.p>
        </motion.div>

        {/* Right Section - Controls */}
        <div className="flex items-center gap-6">
          {/* Demo Mode Toggle */}
          <motion.label className="flex items-center gap-2 cursor-pointer" whileHover={{ scale: 1.05 }}>
            <input
              type="checkbox"
              checked={demoMode}
              onChange={(e) => setDemoMode(e.target.checked)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-sm text-slate-300">Demo Mode</span>
          </motion.label>

          {/* Export Button with Glow */}
          <motion.button
            onClick={() => setExportOpen(true)}
            className="relative flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 rounded text-sm transition font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-cyan-500 rounded blur-lg opacity-0 group-hover:opacity-50"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
            <span className="relative">
              <FiDownload size={16} className="inline" />
            </span>
            <span className="relative">Export</span>
          </motion.button>

          {/* Settings Button with Glow */}
          <motion.button
            className="p-2 hover:bg-slate-700 rounded transition text-slate-400 hover:text-cyan-400"
            whileHover={{ scale: 1.1, textShadow: "0 0 8px rgba(0, 194, 199, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            <FiSettings size={20} />
          </motion.button>
        </div>
      </header>

      {/* Export Modal */}
      <ExportModal isOpen={exportOpen} onClose={() => setExportOpen(false)} />
    </>
  )
}
