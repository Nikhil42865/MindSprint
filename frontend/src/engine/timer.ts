export function getRemainingSeconds(expiresAt: number, now = Date.now()): number {
  return Math.max(0, Math.ceil((expiresAt - now) / 1000));
}

export function getExpiryTimestamp(startedAt: number, durationSeconds: number): number {
  return startedAt + durationSeconds * 1000;
}