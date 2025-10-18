"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Cpu, Download, Zap } from "lucide-react"
import type { ProcessedData, CompressionResult } from "@/lib/types"
import { compareCompressionAlgorithms } from "@/lib/compression-utils"
import { downloadCompressedFile } from "@/lib/download-utils"

interface CompressionPanelProps {
  data: ProcessedData
}

export function CompressionPanel({ data }: CompressionPanelProps) {
  const algorithmColors = [
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
  ]

  const [result, setResult] = useState<CompressionResult | null>(null)
  const [comparing, setComparing] = useState(false)

  const handleCompare = () => {
    setComparing(true)
    setTimeout(() => {
      const compResult = compareCompressionAlgorithms(data)
      setResult(compResult)
      setComparing(false)
    }, 100)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 border-2 border-primary/50 bg-card/50 backdrop-blur-sm neon-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold tracking-wider">[ COMPRESSION ALGORITHM COMPARISON ]</h3>
          </div>
          <Button onClick={handleCompare} disabled={comparing} className="gap-2">
            <Zap className="w-4 h-4" />
            {comparing ? "Comparing..." : "Compare Algorithms"}
          </Button>
        </div>

        {!result && (
          <div className="text-center py-8 text-muted-foreground">
            Click "Compare Algorithms" to analyze Huffman vs Shannon-Fano encoding
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div
              className={`p-6 rounded-lg ${algorithmColors[0].bg} border-2 ${algorithmColors[0].border} ${algorithmColors[0].glow} transition-all`}
            >
              <div className="flex items-center gap-3 mb-3">
                <Zap className={`w-6 h-6 ${algorithmColors[0].text}`} />
                <span className={`font-semibold text-lg ${algorithmColors[0].text}`}>[ CHOSEN ALGORITHM ]</span>
              </div>
              <p className={`text-3xl font-bold font-mono ${algorithmColors[0].text}`}>{result.chosen}</p>
              <p className="text-sm text-muted-foreground mt-2">Selected based on average code length efficiency</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Huffman */}
              <Card
                className={`p-6 border-2 ${algorithmColors[0].border} ${algorithmColors[0].bg} ${algorithmColors[0].glow}`}
              >
                <h4 className={`font-semibold mb-4 text-lg ${algorithmColors[0].text}`}>[ HUFFMAN CODING ]</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 rounded bg-black/30 border border-current/30">
                    <span className="text-muted-foreground">Avg Code Length:</span>
                    <span className={`font-mono font-bold ${algorithmColors[0].text}`}>
                      {result.huffmanAvgLength.toFixed(6)} bits
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-black/30 border border-current/30">
                    <span className="text-muted-foreground">Computation Time:</span>
                    <span className={`font-mono font-bold ${algorithmColors[0].text}`}>
                      {(result.huffmanTime * 1000).toFixed(3)} ms
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-black/30 border border-current/30">
                    <span className="text-muted-foreground">Efficiency:</span>
                    <span className={`font-mono font-bold ${algorithmColors[0].text}`}>
                      {((data.entropy / result.huffmanAvgLength) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </Card>

              {/* Shannon-Fano */}
              <Card
                className={`p-6 border-2 ${algorithmColors[1].border} ${algorithmColors[1].bg} ${algorithmColors[1].glow}`}
              >
                <h4 className={`font-semibold mb-4 text-lg ${algorithmColors[1].text}`}>[ SHANNON-FANO CODING ]</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 rounded bg-black/30 border border-current/30">
                    <span className="text-muted-foreground">Avg Code Length:</span>
                    <span className={`font-mono font-bold ${algorithmColors[1].text}`}>
                      {result.shannonFanoAvgLength.toFixed(6)} bits
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-black/30 border border-current/30">
                    <span className="text-muted-foreground">Computation Time:</span>
                    <span className={`font-mono font-bold ${algorithmColors[1].text}`}>
                      {(result.shannonFanoTime * 1000).toFixed(3)} ms
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-black/30 border border-current/30">
                    <span className="text-muted-foreground">Efficiency:</span>
                    <span className={`font-mono font-bold ${algorithmColors[1].text}`}>
                      {((data.entropy / result.shannonFanoAvgLength) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6 border-2 border-primary/50 bg-card/40 neon-border">
              <h4 className="font-semibold mb-4 text-lg tracking-wider">[ SAMPLE CODES - FIRST 12 SYMBOLS ]</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm font-mono">
                {data.alphabet.slice(0, 12).map((char, idx) => {
                  const code = result.chosen === "Huffman" ? result.huffmanCodes[char] : result.shannonFanoCodes[char]
                  const displayChar = char === " " ? "␣" : char
                  const colors = [
                    "text-purple-300 border-purple-500/60 bg-purple-500/20",
                    "text-pink-300 border-pink-500/60 bg-pink-500/20",
                    "text-red-300 border-red-500/60 bg-red-500/20",
                    "text-orange-300 border-orange-500/60 bg-orange-500/20",
                    "text-yellow-300 border-yellow-500/60 bg-yellow-500/20",
                    "text-green-300 border-green-500/60 bg-green-500/20",
                    "text-cyan-300 border-cyan-500/60 bg-cyan-500/20",
                    "text-blue-300 border-blue-500/60 bg-blue-500/20",
                    "text-indigo-300 border-indigo-500/60 bg-indigo-500/20",
                    "text-violet-300 border-violet-500/60 bg-violet-500/20",
                    "text-fuchsia-300 border-fuchsia-500/60 bg-fuchsia-500/20",
                    "text-rose-300 border-rose-500/60 bg-rose-500/20",
                  ]
                  return (
                    <div
                      key={char}
                      className={`p-3 rounded border-2 ${colors[idx % colors.length]} transition-all hover:scale-105`}
                    >
                      <span className="font-bold">{displayChar}</span>
                      <span className="text-muted-foreground mx-2">→</span>
                      <span className="font-semibold">{code}</span>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Download Button */}
            <Button onClick={() => downloadCompressedFile(data, result)} className="w-full gap-2 size-lg" size="lg">
              <Download className="w-4 h-4" />
              Download Compressed File (.txt with JSON)
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
