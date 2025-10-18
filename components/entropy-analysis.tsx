"use client"

import { Card } from "@/components/ui/card"
import { PMFChart } from "@/components/pmf-chart"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, Zap } from "lucide-react"
import type { ProcessedData } from "@/lib/types"
import { downloadCSV, downloadReport } from "@/lib/download-utils"

interface EntropyAnalysisProps {
  data: ProcessedData
}

export function EntropyAnalysis({ data }: EntropyAnalysisProps) {
  const frequencyColors = [
    {
      bg: "bg-purple-500/30",
      border: "border-purple-500/80",
      text: "text-purple-300",
      glow: "arcade-bright",
      shadowColor: "shadow-purple-500/50",
    },
    {
      bg: "bg-pink-500/30",
      border: "border-pink-500/80",
      text: "text-pink-300",
      glow: "arcade-dim",
      shadowColor: "shadow-pink-500/50",
    },
    {
      bg: "bg-red-500/30",
      border: "border-red-500/80",
      text: "text-red-300",
      glow: "arcade-bright",
      shadowColor: "shadow-red-500/50",
    },
    {
      bg: "bg-orange-500/30",
      border: "border-orange-500/80",
      text: "text-orange-300",
      glow: "arcade-dim",
      shadowColor: "shadow-orange-500/50",
    },
    {
      bg: "bg-yellow-500/30",
      border: "border-yellow-500/80",
      text: "text-yellow-300",
      glow: "arcade-bright",
      shadowColor: "shadow-yellow-500/50",
    },
    {
      bg: "bg-green-500/30",
      border: "border-green-500/80",
      text: "text-green-300",
      glow: "arcade-dim",
      shadowColor: "shadow-green-500/50",
    },
    {
      bg: "bg-cyan-500/30",
      border: "border-cyan-500/80",
      text: "text-cyan-300",
      glow: "arcade-bright",
      shadowColor: "shadow-cyan-500/50",
    },
    {
      bg: "bg-blue-500/30",
      border: "border-blue-500/80",
      text: "text-blue-300",
      glow: "arcade-dim",
      shadowColor: "shadow-blue-500/50",
    },
    {
      bg: "bg-indigo-500/30",
      border: "border-indigo-500/80",
      text: "text-indigo-300",
      glow: "arcade-bright",
      shadowColor: "shadow-indigo-500/50",
    },
    {
      bg: "bg-violet-500/30",
      border: "border-violet-500/80",
      text: "text-violet-300",
      glow: "arcade-dim",
      shadowColor: "shadow-violet-500/50",
    },
    {
      bg: "bg-fuchsia-500/30",
      border: "border-fuchsia-500/80",
      text: "text-fuchsia-300",
      glow: "arcade-bright",
      shadowColor: "shadow-fuchsia-500/50",
    },
    {
      bg: "bg-rose-500/30",
      border: "border-rose-500/80",
      text: "text-rose-300",
      glow: "arcade-dim",
      shadowColor: "shadow-rose-500/50",
    },
  ]

  const topChars = Object.entries(data.counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 12)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-2 border-primary/50 bg-card/40 backdrop-blur-sm neon-border arcade-bright">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground tracking-widest">[ ENTROPY H(X) ]</p>
            <p className="text-2xl font-bold font-mono text-purple-300 neon-text">{data.entropy.toFixed(6)}</p>
            <p className="text-xs text-muted-foreground">bits per symbol</p>
          </div>
        </Card>

        <Card className="p-4 border-2 border-accent/50 bg-card/40 backdrop-blur-sm neon-border-accent arcade-dim">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground tracking-widest">[ RELATIVE ENTROPY ]</p>
            <p className="text-2xl font-bold font-mono text-cyan-300 neon-text">{data.relativeEntropy.toFixed(6)}</p>
            <p className="text-xs text-muted-foreground">bits (vs uniform)</p>
          </div>
        </Card>

        <Card className="p-4 border-2 border-secondary/50 bg-card/40 backdrop-blur-sm arcade-bright">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground tracking-widest">[ TOTAL CHARS ]</p>
            <p className="text-2xl font-bold font-mono text-orange-300">{data.totalChars.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">processed symbols</p>
          </div>
        </Card>
      </div>

      <Card className="p-6 border-2 border-primary/50 bg-card/40 backdrop-blur-sm neon-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold tracking-wider">[ PMF ANALYSIS ]</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadCSV(data)}
            className="gap-2 border-2 border-primary/50 text-primary hover:bg-primary/10"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">EXPORT</span>
          </Button>
        </div>
        <PMFChart data={data} />
      </Card>

      <Card className="p-6 border-2 border-primary/50 bg-card/40 backdrop-blur-sm neon-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold tracking-wider">[ TOP FREQUENCIES ]</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadReport(data)}
            className="gap-2 border-2 border-primary/50 text-primary hover:bg-primary/10"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">REPORT</span>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {topChars.map(([char, count], index) => {
            const displayChar = char === " " ? "␣ space" : char
            const prob = data.pmf[char]
            const colors = frequencyColors[index % frequencyColors.length]
            return (
              <div
                key={char}
                className={`p-4 rounded-lg ${colors.bg} border-2 ${colors.border} ${colors.glow} transition-all hover:scale-105 cursor-pointer`}
                style={{
                  boxShadow: `0 0 15px ${colors.text.replace("text-", "rgb(").replace(")", ")")}, inset 0 0 10px currentColor`,
                }}
              >
                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <span className={`font-mono text-xl font-bold ${colors.text}`}>{displayChar}</span>
                  <span className="text-xs text-muted-foreground font-semibold bg-black/40 px-2 py-1 rounded">
                    {count}
                  </span>
                </div>
                <div className={`text-sm font-mono font-semibold ${colors.text}`}>{(prob * 100).toFixed(3)}%</div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
