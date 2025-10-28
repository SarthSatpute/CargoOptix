"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState(process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000")
  const [demoMode, setDemoMode] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState("1")
  const [theme, setTheme] = useState("dark")

  const handleSave = () => {
    alert("Settings saved successfully!")
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  }

  return (
    <motion.div
      className="p-6 space-y-6 max-w-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h1
        className="text-3xl font-bold text-cyan-400"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        Settings
      </motion.h1>

      {/* API Configuration */}
      <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
        <Card className="bg-slate-900 border-cyan-500/30 p-6">
          <h2 className="text-lg font-semibold text-cyan-400 mb-4">API Configuration</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-300 mb-2 block">API Base URL</Label>
              <Input
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://localhost:8000"
                className="bg-slate-800 border-slate-700 text-white"
              />
              <p className="text-xs text-slate-400 mt-2">
                Configure the backend API endpoint for optimization requests
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Display Settings */}
      <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
        <Card className="bg-slate-900 border-cyan-500/30 p-6">
          <h2 className="text-lg font-semibold text-cyan-400 mb-4">Display Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-slate-300">Demo Mode</Label>
              <Switch checked={demoMode} onCheckedChange={setDemoMode} className="bg-slate-700" />
            </div>

            <div>
              <Label className="text-slate-300 mb-2 block">Animation Speed</Label>
              <Select value={animationSpeed} onValueChange={setAnimationSpeed}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="0.5">Slow (0.5x)</SelectItem>
                  <SelectItem value="1">Normal (1x)</SelectItem>
                  <SelectItem value="1.5">Fast (1.5x)</SelectItem>
                  <SelectItem value="2">Very Fast (2x)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-slate-300 mb-2 block">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div
        custom={2}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button onClick={handleSave} className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold">
          Save Settings
        </Button>
      </motion.div>
    </motion.div>
  )
}
