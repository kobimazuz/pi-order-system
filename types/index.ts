import { User as SupabaseUser } from '@supabase/supabase-js'

export interface User extends SupabaseUser {
  name?: string
  user_metadata: {
    name?: string
  }
} 