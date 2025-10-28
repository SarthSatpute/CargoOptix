"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { X, Send } from "lucide-react"

interface AIAssistantPanelProps {
  isOpen: boolean
  onClose: () => void
  onCommand?: (command: string) => void
}

export function AIAssistantPanel({ isOpen, onClose, onCommand }: AIAssistantPanelProps) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<{ role: "ai" | "user"; text: string }[]>([])

  // Initial greeting
  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          role: "ai",
          text: "Hello, I’m CargoOptix AI Assistant. How can I help you optimize or analyze ship data today?",
        },
      ])
    } else {
      setMessages([])
    }
  }, [isOpen])

  // Gemini API call
  const handleSend = async () => {
    if (!input.trim()) return
    const text = input.trim()

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text }])
    setInput("")

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      })

      const data = await res.json()
      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'm sorry, I couldn’t process that right now."

      // Add AI message
      setMessages((prev) => [...prev, { role: "ai", text: aiText }])
    } catch (error) {
      console.error(error)
      setMessages((prev) => [...prev, { role: "ai", text: "Error connecting to Gemini API." }])
    }
  }

  // Quick command actions
  const handleQuickAction = (action: string) => {
    const responseMap: Record<string, string> = {
      "Optimize Load": "Running the cargo optimization algorithm...",
      "Check Stability": "Recalculating ship stability and center of gravity...",
      "View Reports": "Fetching the latest operational and balance report...",
    }

    setMessages((prev) => [
      ...prev,
      { role: "user", text: action },
      { role: "ai", text: responseMap[action] || "Command received." },
    ])

    if (onCommand) onCommand(action)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Main Assistant Panel */}
          <motion.div
            className="fixed right-0 top-0 h-screen w-96 bg-slate-900/80 backdrop-blur-xl border-l border-cyan-500/30 z-50 flex flex-col"
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-cyan-500/20">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
                <h2 className="text-lg font-semibold text-cyan-400">AI Assistant</h2>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-cyan-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`p-3 rounded-lg border text-sm font-mono ${
                    msg.role === "ai"
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                      : "bg-slate-800/60 border-slate-600/30 text-slate-200 text-right"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {msg.text}
                </motion.div>
              ))}

              {/* Quick Actions */}
              <div className="mt-4 space-y-2">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Quick Actions</p>
                {["Optimize Load", "Check Stability", "View Reports"].map((action) => (
                  <button
                    key={action}
                    onClick={() => handleQuickAction(action)}
                    className="w-full px-4 py-2 text-sm text-cyan-400 border border-cyan-500/30 rounded hover:bg-cyan-500/10 transition-colors text-left"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Field */}
            <div className="border-t border-cyan-500/20 p-4 flex gap-2">
              <input
                type="text"
                placeholder="Ask me anything about CargoOptix..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 px-3 py-2 bg-slate-800/50 border border-cyan-500/20 rounded text-sm text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
              <button
                onClick={handleSend}
                className="p-2 bg-cyan-500/20 border border-cyan-500/30 rounded hover:bg-cyan-500/30 transition"
              >
                <Send size={16} className="text-cyan-300" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
