import type { ProcessedData, BSCResult } from "./types"
import { ALPHABET } from "./entropy-utils"

const ALPHABET_MAP = new Map(ALPHABET.map((c, i) => [c, i]))

function chars6BitEncode(chars: string[]): string {
  return chars.map((c) => (ALPHABET_MAP.get(c) || 0).toString(2).padStart(6, "0")).join("")
}

function simulateBSCFlips(bits: string, p: number, seed: number | null): string {
  const rng = seed !== null ? seededRandom(seed) : Math.random
  return bits
    .split("")
    .map((bit) => {
      if (rng() < p) {
        return bit === "0" ? "1" : "0"
      }
      return bit
    })
    .join("")
}

function seededRandom(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

function bits6BitDecode(bits: string): string[] {
  const chars: string[] = []
  for (let i = 0; i < bits.length - 5; i += 6) {
    const chunk = bits.slice(i, i + 6)
    const idx = Number.parseInt(chunk, 2) % ALPHABET.length
    chars.push(ALPHABET[idx])
  }
  return chars
}

function jointEntropy(xs: string[], ys: string[]): number {
  const counts = new Map<string, number>()
  const n = Math.min(xs.length, ys.length)

  for (let i = 0; i < n; i++) {
    const key = `${xs[i]},${ys[i]}`
    counts.set(key, (counts.get(key) || 0) + 1)
  }

  let entropy = 0
  counts.forEach((count) => {
    const p = count / n
    entropy -= p * Math.log2(p)
  })

  return entropy
}

export function simulateBSC(data: ProcessedData, p: number, seed: number | null): BSCResult {
  // Encode to 6-bit
  const bits = chars6BitEncode(data.mappedChars)

  // Simulate BSC
  const receivedBits = simulateBSCFlips(bits, p, seed)

  // Decode
  const decodedChars = bits6BitDecode(receivedBits)

  // Calculate entropies
  const Hxy = jointEntropy(data.mappedChars, decodedChars)
  const HyGivenX = Hxy - data.entropy
  const chainRuleDiff = Hxy - (data.entropy + HyGivenX)

  return {
    flipProb: p,
    seed,
    bitsLength: bits.length,
    jointEntropy: Hxy,
    conditionalEntropy: HyGivenX,
    chainRuleDiff,
    decodedText: decodedChars.join(""),
  }
}
