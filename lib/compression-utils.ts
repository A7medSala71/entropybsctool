import type { ProcessedData, CompressionResult } from "./types"

interface HuffmanNode {
  char: string | null
  freq: number
  left: HuffmanNode | null
  right: HuffmanNode | null
}

export function buildHuffmanCodes(pmf: Record<string, number>): Record<string, string> {
  const nodes: HuffmanNode[] = Object.entries(pmf).map(([char, freq]) => ({
    char,
    freq,
    left: null,
    right: null,
  }))

  // Build tree
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq)
    const left = nodes.shift()!
    const right = nodes.shift()!
    nodes.push({
      char: null,
      freq: left.freq + right.freq,
      left,
      right,
    })
  }

  const root = nodes[0]
  const codes: Record<string, string> = {}

  function traverse(node: HuffmanNode, code: string) {
    if (node.char !== null) {
      codes[node.char] = code || "0"
      return
    }
    if (node.left) traverse(node.left, code + "0")
    if (node.right) traverse(node.right, code + "1")
  }

  traverse(root, "")
  return codes
}

export function buildShannonFanoCodes(pmf: Record<string, number>): Record<string, string> {
  const items = Object.entries(pmf).sort((a, b) => b[1] - a[1])
  const codes: Record<string, string> = {}
  items.forEach(([char]) => (codes[char] = ""))

  function recurse(subitems: [string, number][]) {
    if (subitems.length <= 1) return

    const total = subitems.reduce((sum, [, p]) => sum + p, 0)
    let acc = 0
    let bestIdx = 1
    let bestDiff = Number.POSITIVE_INFINITY

    for (let i = 1; i < subitems.length; i++) {
      acc += subitems[i - 1][1]
      const diff = Math.abs(total - acc - acc)
      if (diff < bestDiff) {
        bestDiff = diff
        bestIdx = i
      }
    }

    const left = subitems.slice(0, bestIdx)
    const right = subitems.slice(bestIdx)

    left.forEach(([char]) => (codes[char] += "0"))
    right.forEach(([char]) => (codes[char] += "1"))

    recurse(left)
    recurse(right)
  }

  recurse(items)
  return codes
}

function avgCodeLength(codes: Record<string, string>, pmf: Record<string, number>): number {
  return Object.entries(codes).reduce((sum, [char, code]) => {
    return sum + code.length * (pmf[char] || 0)
  }, 0)
}

export function compareCompressionAlgorithms(data: ProcessedData): CompressionResult {
  // Huffman
  const t0 = performance.now()
  const huffmanCodes = buildHuffmanCodes(data.pmf)
  const huffmanTime = (performance.now() - t0) / 1000

  // Shannon-Fano
  const t1 = performance.now()
  const shannonFanoCodes = buildShannonFanoCodes(data.pmf)
  const shannonFanoTime = (performance.now() - t1) / 1000

  const huffmanAvgLength = avgCodeLength(huffmanCodes, data.pmf)
  const shannonFanoAvgLength = avgCodeLength(shannonFanoCodes, data.pmf)

  const chosen =
    Math.abs(huffmanAvgLength - shannonFanoAvgLength) < 1e-12
      ? "Shannon-Fano"
      : huffmanAvgLength < shannonFanoAvgLength
        ? "Huffman"
        : "Shannon-Fano"

  const chosenCodes = chosen === "Huffman" ? huffmanCodes : shannonFanoCodes
  const compressedBits = data.mappedChars.map((c) => chosenCodes[c]).join("")

  return {
    chosen,
    huffmanCodes,
    shannonFanoCodes,
    huffmanAvgLength,
    shannonFanoAvgLength,
    huffmanTime,
    shannonFanoTime,
    compressedBits,
  }
}

export function decodeCompressedFile(jsonText: string): string {
  try {
    const payload = JSON.parse(jsonText)

    // Validate the payload structure
    if (!payload.codebook || !payload.encoded_data) {
      throw new Error("Invalid file format: missing codebook or encoded_data")
    }

    const { codebook, encoded_data } = payload

    // Build reverse lookup (code -> symbol)
    const reverseCodebook: Record<string, string> = {}
    Object.entries(codebook).forEach(([symbol, code]) => {
      reverseCodebook[code as string] = symbol
    })

    // Decode using prefix matching
    const decoded: string[] = []
    let buffer = ""

    for (const bit of encoded_data) {
      buffer += bit
      if (reverseCodebook[buffer]) {
        decoded.push(reverseCodebook[buffer])
        buffer = ""
      }
    }

    // Check if there's any remaining buffer (incomplete code)
    if (buffer.length > 0) {
      console.warn("[v0] Warning: Incomplete code sequence at end of file:", buffer)
    }

    return decoded.join("")
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Invalid JSON format. Please ensure the file is a valid compressed file.")
    }
    throw error
  }
}
