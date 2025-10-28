"use client"

import type { ReactNode } from "react"
import Header from "./Header"
import Footer from "./Footer"

interface PageLayoutProps {
  children: ReactNode
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white">
      {/* Header */}
      <Header />

      {/* Main Content - Three Column Layout */}
      <div className="flex flex-1 overflow-hidden gap-0">{children}</div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
