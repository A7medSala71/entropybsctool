"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Binary, Play } from "lucide-react"
import type { ProcessedData, BSCResult } from "@/lib/types"
import { simulateBSC } from "@/lib/bsc-utils"

interface BSCSimulationProps {
  data: ProcessedData
}

export function BSCSimulation({ data }: BSCSimulationProps) {
  const statColors = [
    {
      bg: "bg-purple-500/30",
      border: "border-purple-500/80",
      text: "text-purple-300",
      glow: "arcade-bright",
    },
    {
      bg: "bg-cyan-500/30",
      border: "border-cyan-500/80",
      text: "text-cyan-300",
      glow: "arcade-dim",
    },
    {
      bg: "bg-green-500/30",
      border: "border-green-500/80",
      text: "text-green-300",
      glow: "arcade-bright",
    },
    {
      bg: "bg-orange-500/30",
      border: "border-orange-500/80",
      text: "text-orange-300",
      glow: "arcade-dim",
    },
  ]

  const [flipProb, setFlipProb] = useState("0.05")
  const [seed, setSeed] = useState("random")
  const [result, setResult] = useState<BSCResult | null>(null)
  const [simulating, setSimulating] = useState(false)

  const handleSimulate = () => {
    setSimulating(true)
    setTimeout(() => {
      const p = Number.parseFloat(flipProb)
      const seedValue = seed.toLowerCase() === "random" ? null : Number.parseInt(seed)
      const bscResult = simulateBSC(data, p, seedValue)
      setResult(bscResult)
      setSimulating(false)
    }, 100)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 border-2 border-primary/50 bg-card/50 backdrop-blur-sm neon-border">
        <div className="flex items-center gap-2 mb-4">
          <Binary className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold tracking-wider">[ BINARY SYMMETRIC CHANNEL SIMULATION ]</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="flip-prob" className="text-sm font-semibold">
              Flip Probability (p)
            </Label>
            <Input
              id="flip-prob"
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={flipProb}
              onChange={(e) => setFlipProb(e.target.value)}
              className="bg-secondary/50 border-border/50 border-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seed" className="text-sm font-semibold">
              Random Seed
            </Label>
            <Input
              id="seed"
              type="text"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="random or integer"
              className="bg-secondary/50 border-border/50 border-2"
            />
          </div>

          <div className="flex items-end">
            <Button onClick={handleSimulate} disabled={simulating} className="w-full gap-2 font-semibold">
              <Play className="w-4 h-4" />
              {simulating ? "Simulating..." : "Run Simulation"}
            </Button>
          </div>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "H(X,Y)", value: result.jointEntropy.toFixed(6), desc: "Joint Entropy", color: statColors[0] },
                {
                  label: "H(Y|X)",
                  value: result.conditionalEntropy.toFixed(6),
                  desc: "Conditional Entropy",
                  color: statColors[1],
                },
                {
                  label: "Chain Rule",
                  value: result.chainRuleDiff.toExponential(2),
                  desc: "Verification (≈0)",
                  color: statColors[2],
                },
                {
                  label: "Bit Length",
                  value: result.bitsLength.toLocaleString(),
                  desc: "Total Bits",
                  color: statColors[3],
                },
              ].map((stat, idx) => (
                <Card
                  key={idx}
                  className={`p-4 border-2 ${stat.color.border} ${stat.color.bg} ${stat.color.glow} transition-all`}
                >
                  <p className="text-xs text-muted-foreground mb-2 font-semibold tracking-wider">[ {stat.label} ]</p>
                  <p className={`text-xl font-bold font-mono ${stat.color.text}`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
                </Card>
              ))}
            </div>

            {/* Decoded Text Preview */}
            <Card className="p-4 border-2 border-primary/50 bg-secondary/30 neon-border">
              <h4 className="font-semibold mb-3 tracking-wider">[ DECODED TEXT PREVIEW - FIRST 500 CHARS ]</h4>
              <div className="p-3 rounded bg-background/50 border-2 border-primary/30 font-mono text-sm overflow-x-auto">
                <pre className="whitespace-pre-wrap break-words text-muted-foreground">
                  {result.decodedText.slice(0, 500)}
                  {result.decodedText.length > 500 && "..."}
                </pre>
              </div>
            </Card>

            {/* Simulation Info */}
            <Card className="p-4 border-2 border-primary/50 bg-primary/10 neon-border">
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="p-2 rounded bg-black/30 border border-primary/30">
                  <span className="text-muted-foreground">Flip Probability:</span>
                  <span className="ml-2 font-mono font-semibold text-primary">{result.flipProb}</span>
                </div>
                <div className="p-2 rounded bg-black/30 border border-primary/30">
                  <span className="text-muted-foreground">Seed:</span>
                  <span className="ml-2 font-mono font-semibold text-primary">{result.seed ?? "random"}</span>
                </div>
                <div className="p-2 rounded bg-black/30 border border-primary/30">
                  <span className="text-muted-foreground">Symbols Decoded:</span>
                  <span className="ml-2 font-mono font-semibold text-primary">
                    {result.decodedText.length.toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {!result && (
          <div className="text-center py-8 text-muted-foreground">
            Configure parameters and click "Run Simulation" to simulate a Binary Symmetric Channel
          </div>
        )}
      </Card>
    </div>
  )
}
