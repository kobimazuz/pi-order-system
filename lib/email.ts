import { createClient } from '@supabase/supabase-js'

interface EmailOptions {
  to: string
  subject: string
  text: string
  html: string
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const { error } = await supabase.functions.invoke('send-email', {
      body: {
        to,
        subject,
        html,
      },
    })

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
} 