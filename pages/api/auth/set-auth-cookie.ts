import { NextApiRequest, NextApiResponse } from 'next'
import { createBrowserClient } from '@supabase/ssr'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { event, session } = req.body

  if (event === 'SIGNED_IN') {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Set cookie with SameSite=Lax
    res.setHeader('Set-Cookie', [
      `sb-access-token=${session?.access_token}; Path=/; HttpOnly; SameSite=Lax`,
      `sb-refresh-token=${session?.refresh_token}; Path=/; HttpOnly; SameSite=Lax`
    ])
  }

  return res.status(200).json({ message: 'Cookie set successfully' })
} 