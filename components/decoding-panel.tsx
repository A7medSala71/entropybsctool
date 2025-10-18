"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Upload, Download, AlertCircle, CheckCircle2 } from "lucide-react"
import { decodeCompressedFile } from "@/lib/compression-utils"

export function DecodingPanel() {
  const [decodedText, setDecodedText] = useState("")
  const [fileName, setFileName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setSuccess(false)
    setDecodedText("")

    try {
      console.log("[v0] Loading file:", file.name)
      const text = await file.text()
      console.log("[v0] File content length:", text.length)

      const decoded = decodeCompressedFile(text)
      console.log("[v0] Successfully decoded, length:", decoded.length)

      setDecodedText(decoded)
      setFileName(file.name)
      setSuccess(true)
    } catch (error) {
      console.error("[v0] Error decoding file:", error)
      const errorMessage =
        error instanceof Error ? error.message : "Failed to decode file. Please ensure it is a valid compressed file."
      setError(errorMessage)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([decodedText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName.replace(".txt", "_decoded.txt") || "decoded.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Load and Decode Compressed File</h3>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input ref={fileInputRef} type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              Load Encoded File
            </Button>

            {decodedText && (
              <Button onClick={handleDownload} className="gap-2">
                <Download className="w-4 h-4" />
                Save Decoded Text
              </Button>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Decoding Error</p>
                <p className="text-sm text-destructive/80 mt-1">{error}</p>
              </div>
            </div>
          )}

          {success && !error && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <p className="text-sm text-green-600 dark:text-green-400">File decoded successfully!</p>
            </div>
          )}

          {fileName && !error && (
            <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
              <p className="text-sm">
                <span className="text-muted-foreground">Loaded:</span>{" "}
                <span className="font-mono text-primary">{fileName}</span>
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Decoded Text</label>
            <Textarea
              value={decodedText}
              readOnly
              placeholder="Decoded text will appear here..."
              className="min-h-[400px] font-mono text-sm bg-secondary/30 border-border/50"
            />
            {decodedText && (
              <p className="text-xs text-muted-foreground">{decodedText.length.toLocaleString()} characters decoded</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
