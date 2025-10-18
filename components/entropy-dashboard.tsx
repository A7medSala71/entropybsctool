"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUpload } from "@/components/file-upload"
import { EntropyAnalysis } from "@/components/entropy-analysis"
import { CompressionPanel } from "@/components/compression-panel"
import { BSCSimulation } from "@/components/bsc-simulation"
import { DecodingPanel } from "@/components/decoding-panel"
import { Activity, Binary, Cpu, FileText, Zap } from "lucide-react"
import type { ProcessedData } from "@/lib/types"

export function EntropyDashboard() {
  console.log("[v0] EntropyDashboard component mounting")
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null)

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(0deg, transparent 24%, rgba(112, 128, 144, 0.05) 25%, rgba(112, 128, 144, 0.05) 26%, transparent 27%, transparent 74%, rgba(112, 128, 144, 0.05) 75%, rgba(112, 128, 144, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(112, 128, 144, 0.05) 25%, rgba(112, 128, 144, 0.05) 26%, transparent 27%, transparent 74%, rgba(112, 128, 144, 0.05) 75%, rgba(112, 128, 144, 0.05) 76%, transparent 77%, transparent)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <header className="border-b-2 border-primary/50 bg-card/30 backdrop-blur-md sticky top-0 z-50 neon-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/20 border-2 border-primary neon-border">
              <Zap className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wider neon-text">ENTROPY ARCADE</h1>
              <p className="text-xs text-accent tracking-widest">[ DATA COMPRESSION SIMULATOR ]</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-6 relative z-10">
        <Card className="p-6 border-2 border-primary/50 bg-card/40 backdrop-blur-sm neon-border">
          <FileUpload onDataProcessed={setProcessedData} />
        </Card>

        {processedData && (
          <Tabs defaultValue="analysis" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-card/50 border-2 border-primary/50 neon-border">
              <TabsTrigger
                value="analysis"
                className="gap-2 data-[state=active]:bg-primary/30 data-[state=active]:text-primary"
              >
                <Activity className="w-4 h-4" />
                <span className="hidden sm:inline">ANALYSIS</span>
              </TabsTrigger>
              <TabsTrigger
                value="compression"
                className="gap-2 data-[state=active]:bg-primary/30 data-[state=active]:text-primary"
              >
                <Cpu className="w-4 h-4" />
                <span className="hidden sm:inline">COMPRESS</span>
              </TabsTrigger>
              <TabsTrigger
                value="bsc"
                className="gap-2 data-[state=active]:bg-primary/30 data-[state=active]:text-primary"
              >
                <Binary className="w-4 h-4" />
                <span className="hidden sm:inline">BSC SIM</span>
              </TabsTrigger>
              <TabsTrigger
                value="decode"
                className="gap-2 data-[state=active]:bg-primary/30 data-[state=active]:text-primary"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">DECODE</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-6">
              <EntropyAnalysis data={processedData} />
            </TabsContent>

            <TabsContent value="compression" className="space-y-6">
              <CompressionPanel data={processedData} />
            </TabsContent>

            <TabsContent value="bsc" className="space-y-6">
              <BSCSimulation data={processedData} />
            </TabsContent>

            <TabsContent value="decode" className="space-y-6">
              <DecodingPanel />
            </TabsContent>
          </Tabs>
        )}

        {!processedData && (
          <Card className="p-12 border-2 border-accent/50 bg-card/30 backdrop-blur-sm neon-border-accent">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-lg bg-accent/10 border-2 border-accent flex items-center justify-center neon-border-accent">
                  <FileText className="w-10 h-10 text-accent animate-pulse" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-accent tracking-wider">[ AWAITING INPUT ]</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto tracking-wide">
                Upload a text file to begin entropy analysis, compression comparison, and BSC simulation
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
