"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ScenarioModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ScenarioModal({ isOpen, onClose }: ScenarioModalProps) {
  const [name, setName] = useState("")
  const [containerCount, setContainerCount] = useState("")
  const [seaCondition, setSeaCondition] = useState("calm")

  const handleSubmit = () => {
    if (name && containerCount) {
      alert(`Scenario "${name}" created with ${containerCount} containers`)
      setName("")
      setContainerCount("")
      setSeaCondition("calm")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-cyan-500/30">
        <DialogHeader>
          <DialogTitle className="text-cyan-400">Add New Scenario</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-slate-300">Scenario Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Scenario 4"
              className="bg-slate-800 border-slate-700 text-white mt-1"
            />
          </div>

          <div>
            <Label className="text-slate-300">Container Count</Label>
            <Input
              type="number"
              value={containerCount}
              onChange={(e) => setContainerCount(e.target.value)}
              placeholder="e.g., 450"
              className="bg-slate-800 border-slate-700 text-white mt-1"
            />
          </div>

          <div>
            <Label className="text-slate-300">Sea Condition</Label>
            <Select value={seaCondition} onValueChange={setSeaCondition}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="calm">Calm</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="rough">Rough</SelectItem>
                <SelectItem value="severe">Severe</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline" className="border-slate-700 text-slate-300 bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-cyan-500 hover:bg-cyan-600 text-slate-950">
            Create Scenario
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
