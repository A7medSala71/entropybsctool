"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { ProcessedData } from "@/lib/types"

interface PMFChartProps {
  data: ProcessedData
}

export function PMFChart({ data }: PMFChartProps) {
  const colorPalette = [
    "hsl(280, 100%, 60%)", // Vibrant purple
    "hsl(320, 100%, 60%)", // Hot pink
    "hsl(0, 100%, 60%)", // Bright red
    "hsl(40, 100%, 60%)", // Golden yellow
    "hsl(80, 100%, 60%)", // Lime green
    "hsl(120, 100%, 50%)", // Bright green
    "hsl(160, 100%, 50%)", // Cyan
    "hsl(200, 100%, 60%)", // Sky blue
    "hsl(240, 100%, 60%)", // Electric blue
    "hsl(260, 100%, 60%)", // Indigo
  ]

  const chartData = data.alphabet.map((char, index) => ({
    char: char === " " ? "␣" : char,
    probability: data.pmf[char],
    fill: colorPalette[index % colorPalette.length],
  }))

  return (
    <ChartContainer
      config={{
        probability: {
          label: "Probability",
          color: "hsl(var(--primary))",
        },
      }}
      className="h-[400px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="char" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            tickFormatter={(value) => value.toFixed(3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="probability" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
