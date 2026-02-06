import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type for our database
export type Link = {
  id: string
  slug: string
  recipient_name: string
  creator_name: string | null
  theme_id: number
  icon_url: string | null
  is_anonymous: boolean
  response: 'yes' | 'no' | null
  created_at: string
}