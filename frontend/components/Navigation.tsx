"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { LayoutDashboard, Package, Zap, BarChart3, Settings, ChevronLeft, ChevronRight } from "lucide-react"
import { useStore } from "@/lib/store"

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Scenarios",
    href: "/dashboard/scenarios",
    icon: Package,
  },
  {
    label: "AI Assistant",
    href: "/dashboard/ai-assistant",
    icon: Zap,
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export default function Navigation() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useStore()

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
  }

  return (
    <motion.nav
      className="bg-slate-900 border-r border-cyan-500/20 flex flex-col relative"
      animate={{ width: sidebarOpen ? 256 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Logo */}
      <motion.div
        className="p-6 border-b border-cyan-500/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.h1
          className="text-2xl font-bold text-cyan-400"
          animate={{ opacity: sidebarOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          CargoOptix
        </motion.h1>
        {!sidebarOpen && (
          <motion.div
            className="text-xl font-bold text-cyan-400 absolute left-6 top-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            CO
          </motion.div>
        )}
        <motion.p
          className="text-xs text-slate-400 mt-1"
          animate={{ opacity: sidebarOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          Ship Optimization
        </motion.p>
      </motion.div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        {navItems.map((item, i) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <motion.div key={item.href} custom={i} variants={itemVariants} initial="hidden" animate="visible">
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all ${
                  isActive
                    ? "bg-cyan-500/20 border-l-2 border-cyan-400 text-cyan-400 shadow-lg shadow-cyan-500/20"
                    : "text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50"
                }`}
              >
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Icon className="w-5 h-5 flex-shrink-0" />
                </motion.div>
                <motion.span
                  className="font-medium whitespace-nowrap"
                  animate={{ opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? "auto" : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
                {isActive && sidebarOpen && (
                  <motion.div
                    className="ml-auto w-1 h-1 bg-cyan-400 rounded-full"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Footer with Toggle Button */}
      <motion.div
        className="p-4 border-t border-cyan-500/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <motion.p
          className="text-xs text-slate-500 mb-3"
          animate={{ opacity: sidebarOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          v1.0.0
        </motion.p>

        <motion.button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-cyan-400 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          <motion.span
            animate={{ opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? "auto" : 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs whitespace-nowrap"
          >
            {sidebarOpen ? "Collapse" : ""}
          </motion.span>
        </motion.button>
      </motion.div>
    </motion.nav>
  )
}
