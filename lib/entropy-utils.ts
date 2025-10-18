import type { ProcessedData } from "./types"

// 64-character alphabet
const LOWER = "abcdefghijklmnopqrstuvwxyz".split("")
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
const DIGITS = "123456789".split("")
const OTHERS = [" ", ",", "."]
export const ALPHABET = [...LOWER, ...UPPER, ...DIGITS, ...OTHERS]

const ALPHABET_MAP = new Map(ALPHABET.map((c, i) => [c, i]))

export function mapChar(char: string): string {
  return ALPHABET_MAP.has(char) ? char : " "
}

export function processTextFile(text: string, fileName: string): ProcessedData {
  // Map characters to allowed alphabet
  const mappedChars = text.split("").map(mapChar)

  // Count frequencies
  const counts: Record<string, number> = {}
  ALPHABET.forEach((c) => (counts[c] = 0))
  mappedChars.forEach((c) => counts[c]++)

  const totalChars = mappedChars.length

  // Calculate PMF
  const pmf: Record<string, number> = {}
  ALPHABET.forEach((c) => {
    pmf[c] = totalChars > 0 ? counts[c] / totalChars : 0
  })

  // Calculate entropy H(X)
  let entropy = 0
  ALPHABET.forEach((c) => {
    const p = pmf[c]
    if (p > 0) {
      entropy -= p * Math.log2(p)
    }
  })

  // Calculate relative entropy D(P||U)
  const uniformProb = 1 / ALPHABET.length
  let relativeEntropy = 0
  ALPHABET.forEach((c) => {
    const p = pmf[c]
    if (p > 0) {
      relativeEntropy += p * Math.log2(p / uniformProb)
    }
  })

  return {
    fileName,
    text,
    mappedChars,
    alphabet: ALPHABET,
    counts,
    pmf,
    totalChars,
    entropy,
    relativeEntropy,
  }
}
