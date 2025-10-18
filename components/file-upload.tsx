"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Loader2 } from "lucide-react"
import { processTextFile } from "@/lib/entropy-utils"
import type { ProcessedData } from "@/lib/types"

interface FileUploadProps {
  onDataProcessed: (data: ProcessedData) => void
}

export function FileUpload({ onDataProcessed }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "text/plain") {
      setFile(selectedFile)
    }
  }

  const handleProcess = async () => {
    if (!file) return

    setProcessing(true)
    try {
      const text = await file.text()
      const data = processTextFile(text, file.name)
      onDataProcessed(data)
    } catch (error) {
      console.error("Error processing file:", error)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold tracking-wider">[ FILE UPLOAD ]</h2>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="file-upload" className="text-xs tracking-widest">
            TEXT FILE (.TXT)
          </Label>
          <div className="flex gap-2">
            <Input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              className="flex-1 bg-input/50 border-2 border-primary/30 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
            />
            <Button
              onClick={handleProcess}
              disabled={!file || processing}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-primary"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">PROCESS</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">PROCESS</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {file && (
          <div className="p-3 rounded-lg bg-secondary/20 border-2 border-secondary/50">
            <p className="text-xs font-mono tracking-wide">
              <span className="text-muted-foreground">[ FILE ]</span>{" "}
              <span className="text-secondary">{file.name}</span>
              <span className="text-muted-foreground ml-2">({(file.size / 1024).toFixed(2)} KB)</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
