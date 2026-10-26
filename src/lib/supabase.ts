import { createClient } from '@supabase/supabase-js'
import { demoFetch } from './demo'

const demo = import.meta.env.VITE_DEMO === '1'
const url = demo ? 'https://demo.supabase.co' : (import.meta.env.VITE_SUPABASE_URL as string | undefined)
const anonKey = demo ? 'demo' : (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)

// Null when .env is missing; the app then shows a setup screen instead of a login.
export const supabase = url && anonKey
  ? createClient(url, anonKey, demo ? { global: { fetch: demoFetch }, auth: { persistSession: false } } : undefined)
  : null
