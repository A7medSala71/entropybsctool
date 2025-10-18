export interface ProcessedData {
  fileName: string
  text: string
  mappedChars: string[]
  alphabet: string[]
  counts: Record<string, number>
  pmf: Record<string, number>
  totalChars: number
  entropy: number
  relativeEntropy: number
}

export interface CompressionResult {
  chosen: "Huffman" | "Shannon-Fano"
  huffmanCodes: Record<string, string>
  shannonFanoCodes: Record<string, string>
  huffmanAvgLength: number
  shannonFanoAvgLength: number
  huffmanTime: number
  shannonFanoTime: number
  compressedBits: string
}

export interface BSCResult {
  flipProb: number
  seed: number | null
  bitsLength: number
  jointEntropy: number
  conditionalEntropy: number
  chainRuleDiff: number
  decodedText: string
}
