export const APIKEY = process.env.NEXT_PUBLIC_API_KEY
export const BASE_API_URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`
  : `http://localhost:3000/api`
