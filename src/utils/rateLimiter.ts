type TokenBucket = { tokens: number; lastRefill: number }

const buckets: Record<string, TokenBucket> = {}

export function isRateLimited(key: string, ratePerMinute = 30): boolean {
  const now = Date.now()
  const capacity = ratePerMinute
  const refillIntervalMs = 60_000
  const refillAmountPerMs = capacity / refillIntervalMs

  const bucket = buckets[key] ?? { tokens: capacity, lastRefill: now }
  const elapsed = now - bucket.lastRefill
  bucket.tokens = Math.min(capacity, bucket.tokens + elapsed * refillAmountPerMs)
  bucket.lastRefill = now

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1
    buckets[key] = bucket
    return false
  }

  buckets[key] = bucket
  return true
}