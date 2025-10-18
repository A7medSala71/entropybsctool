import type { ProcessedData, CompressionResult } from "./types"

export function downloadCSV(data: ProcessedData) {
  const rows = [["symbol", "index", "count", "probability"]]

  data.alphabet.forEach((char, i) => {
    const count = data.counts[char]
    const prob = data.pmf[char]
    rows.push([char, i.toString(), count.toString(), prob.toFixed(12)])
  })

  const csv = rows.map((row) => row.join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${data.fileName.replace(".txt", "")}_pmf.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadReport(data: ProcessedData) {
  const lines = [
    `Entropy Analysis Report`,
    `======================`,
    ``,
    `Source File: ${data.fileName}`,
    `Total Characters: ${data.totalChars}`,
    ``,
    `Entropy H(X): ${data.entropy.toFixed(12)} bits`,
    `Relative Entropy D(P||U): ${data.relativeEntropy.toFixed(12)} bits`,
    ``,
    `Top Character Frequencies:`,
    ``,
  ]

  const sorted = Object.entries(data.counts).sort((a, b) => b[1] - a[1])
  sorted.slice(0, 30).forEach(([char, count]) => {
    const display = char === " " ? "'space'" : char
    const prob = data.pmf[char]
    lines.push(`  ${display.padEnd(8)} : ${count} (${(prob * 100).toFixed(6)}%)`)
  })

  const text = lines.join("\n")
  const blob = new Blob([text], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${data.fileName.replace(".txt", "")}_report.txt`
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadCompressedFile(data: ProcessedData, result: CompressionResult) {
  const payload = {
    algorithm: result.chosen,
    codebook: result.chosen === "Huffman" ? result.huffmanCodes : result.shannonFanoCodes,
    encoded_data: result.compressedBits,
    metadata: {
      source_file: data.fileName,
      total_symbols: data.totalChars,
      timestamp: Date.now(),
    },
  }

  const json = JSON.stringify(payload, null, 2)
  const blob = new Blob([json], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${data.fileName.replace(".txt", "")}_compressed.txt`
  a.click()
  URL.revokeObjectURL(url)
}
