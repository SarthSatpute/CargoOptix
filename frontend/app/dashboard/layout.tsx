"use client"

import type React from "react"
import { motion } from "framer-motion"
import Navigation from "@/components/Navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useStore } from "@/lib/store"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { sidebarOpen } = useStore()

  return (
    <div className="flex h-screen bg-slate-950 text-white">
      {/* Navigation Sidebar */}
      <Navigation />

      {/* Main Content Area */}
      <motion.div
        className="flex flex-col flex-1 overflow-hidden"
        animate={{ marginLeft: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Header */}
        <Header />

        {/* Page Content with Framer Motion */}
        <motion.main
          className="flex-1 overflow-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {children}
        </motion.main>

        {/* Footer */}
        <Footer />
      </motion.div>
    </div>
  )
}
