"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send } from "lucide-react"
import { getGeminiResponse } from "@/lib/gemini"

interface Message {
  id: string
  text: string
  sender: "user" | "assistant"
  timestamp: Date
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Welcome to CargoOptix AI Assistant. I can analyze optimization reports and ship stability metrics.",
      sender: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Fetch from Gemini
    const aiReply = await getGeminiResponse(userMessage.text)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: aiReply,
      sender: "assistant",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsLoading(false)
  }

  const messageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  }

  return (
    <motion.div className="flex flex-col h-full p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.h1 className="text-3xl font-bold text-cyan-400 mb-6">AI Assistant</motion.h1>

      {/* Chat Section */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              variants={messageVariants}
              initial="initial"
              animate="animate"
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`max-w-xs lg:max-w-md px-4 py-2 ${
                  message.sender === "user"
                    ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-100"
                    : "bg-slate-800 border-slate-700 text-slate-100"
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.text}</p>
                <p className="text-xs text-slate-400 mt-1">{message.timestamp.toLocaleTimeString()}</p>
              </Card>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div className="flex justify-start">
              <Card className="bg-slate-800 border-slate-700 px-4 py-2">
                <div className="flex gap-2">
                  <motion.div className="w-2 h-2 bg-cyan-400 rounded-full" animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity }} />
                  <motion.div className="w-2 h-2 bg-cyan-400 rounded-full" animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }} />
                  <motion.div className="w-2 h-2 bg-cyan-400 rounded-full" animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Ask me about ship load optimization..."
          className="bg-slate-800 border-slate-700 text-white placeholder-slate-400"
        />
        <Button
          onClick={handleSendMessage}
          disabled={isLoading || !input.trim()}
          className="bg-cyan-500 hover:bg-cyan-600 text-slate-950"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  )
}
