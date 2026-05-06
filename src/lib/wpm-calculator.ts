export function calcRawWPM(keystrokes: number, elapsedSec: number): number {
  if (elapsedSec <= 0) return 0;
  return (keystrokes / 5) / (elapsedSec / 60);
}

export function calcNetWPM(correctChars: number, elapsedSec: number): number {
  if (elapsedSec <= 0) return 0;
  return (correctChars / 5) / (elapsedSec / 60);
}

export function calcAccuracy(correctChars: number, totalTyped: number): number {
  if (totalTyped === 0) return 100;
  return (correctChars / totalTyped) * 100;
}

export function calcConsistency(wpmHistory: number[]): number {
  if (wpmHistory.length < 2) return 100;
  
  const mean = wpmHistory.reduce((a, b) => a + b, 0) / wpmHistory.length;
  if (mean === 0) return 100;
  
  const variance = wpmHistory.reduce((sum, w) => sum + (w - mean) ** 2, 0) / wpmHistory.length;
  const stddev = Math.sqrt(variance);
  
  // Consistency formula: 100 - (Coefficient of Variation * 100)
  // We clamp it between 0 and 100
  const consistency = 100 - (stddev / mean) * 100;
  return Math.max(0, Math.min(100, consistency));
}
