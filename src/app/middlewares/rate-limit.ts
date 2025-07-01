import rateLimit from 'express-rate-limit'

export const limiter = (minutes: number, limit: number) => {
  return rateLimit({
    windowMs: minutes * 60 * 1000, // 15 minutes
    max: limit, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
}
