import { createClient } from '@supabase/supabase-js'

// This function runs every 5 days to keep Supabase from pausing
// (Supabase free tier pauses after 7 days of inactivity)
export default async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials for keep-alive')
    return new Response('Missing credentials', { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Lightweight ping — just select 1 row from site_settings
    const { data, error } = await supabase
      .from('site_settings')
      .select('id')
      .limit(1)

    if (error) throw error

    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] Supabase keep-alive ping successful:`, data)
    return new Response(JSON.stringify({ ok: true, timestamp }), { status: 200 })
  } catch (err) {
    console.error('Keep-alive ping failed:', err)
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 })
  }
}
