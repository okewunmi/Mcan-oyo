/**
 * SEED SCRIPT — Import daily-content.json into Supabase
 * 
 * Run with:
 *   npx ts-node --project tsconfig.json scripts/seed-daily-content.ts
 * 
 * Or paste directly into the Supabase SQL Editor using the JSON data.
 */

import { createClient } from '@supabase/supabase-js'
import dailyContent from '../data/daily-content.json'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, serviceKey)

async function seed() {
  console.log('Seeding daily content...')

  const allItems: any[] = []

  for (const [day, items] of Object.entries(dailyContent as Record<string, any[]>)) {
    for (const item of items) {
      allItems.push({
        day_of_week:         day,
        content_type:        item.content_type,
        title:               item.title,
        arabic_text:         item.arabic_text || null,
        english_text:        item.english_text || null,
        transliteration:     item.transliteration || null,
        chain_of_narration:  item.chain_of_narration || null,
        reported_by:         item.reported_by || null,
        lesson:              item.lesson || null,
        benefits:            item.benefits || null,
        source:              item.source || null,
        extra_notes:         item.extra_notes || null,
        is_published:        true,
      })
    }
  }

  const { error } = await supabase.from('daily_content').insert(allItems)
  if (error) {
    console.error('Seed failed:', error)
  } else {
    console.log(`✅ Seeded ${allItems.length} daily content items`)
  }
}

seed()
