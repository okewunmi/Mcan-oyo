import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export const supabase = createClient()

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Executive {
  id: string
  name: string
  position: string
  batch?: string
  phone?: string
  email?: string
  photo_url?: string
  sort_order: number
}

export interface LGIContact {
  id: string
  lga: string
  lgi_name?: string
  lgi_phone?: string
  mclo_name?: string
  mclo_phone?: string
  zone?: string
  sort_order: number
}

export interface Lodge {
  id: string
  name: string
  lga: string
  address?: string
  landmark?: string
  lat?: number
  lng?: number
  capacity?: number
  contact_name?: string
  contact_phone?: string
  google_maps_url?: string
}

export interface Event {
  id: string
  title: string
  slug: string
  description?: string
  event_date: string
  end_date?: string
  location?: string
  image_url?: string
  is_live: boolean
  live_link?: string
  is_published: boolean
  tags?: string[]
  created_at: string
}

export interface DailyContent {
  id: string
  day_of_week: string
  content_type: string
  title: string
  arabic_text?: string
  english_text?: string
  transliteration?: string
  chain_of_narration?: string
  reported_by?: string
  lesson?: string
  benefits?: string
  source?: string
  extra_notes?: string
  is_published: boolean
  publish_date?: string
  created_at: string
}

export interface Registration {
  id: string
  full_name: string
  state_code: string
  state_of_origin: string
  phone: string
  email: string
  gender: 'male' | 'female'
  batch: 'A' | 'B' | 'C'
  stream: '1' | '2'
  service_year: number
  ppa?: string
  lga_of_posting?: string
  is_verified: boolean
  created_at: string
}

export interface SiteSettings {
  [key: string]: string
}
