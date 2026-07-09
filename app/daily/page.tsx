import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import DailyPageClient from './DailyPageClient'
import type { DailyContent } from '@/lib/supabase'
import dailyContentData from '@/data/daily-contents.json'

export const metadata: Metadata = {
  title: 'Daily Content',
  description: "Daily Islamic content for MCAN corps members.",
}

const DAY_IDX = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']

function getAllWeeksForDay(day: string): DailyContent[] {
  const json = (dailyContentData as any).content
  const results: DailyContent[] = []

  // Loop through all 52 weeks and collect entries for the requested day
  for (let w = 1; w <= 52; w++) {
    const weekKey = `week_${w}`
    const entries = json?.[weekKey]?.[day]
    if (Array.isArray(entries)) {
      entries.forEach(entry => {
        results.push({
          ...entry,
          // tag each entry with its week so the UI can show "Week 7" if needed
          week_number: w,
        } as DailyContent)
      })
    }
  }

  return results
}

async function getDailyContent(day: string): Promise<DailyContent[]> {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('daily_content')
    .select('*')
    .eq('is_published', true)
    .eq('day_of_week', day)
    .order('created_at', { ascending: false })
    .limit(20)

  if (data && data.length > 0) return data as DailyContent[]

  // Fallback: pull all 52 weeks worth of content for this day from JSON
  return getAllWeeksForDay(day)
}

interface PageProps {
  searchParams: { day?: string }
}

export default async function DailyPage({ searchParams }: PageProps) {
  const todayIdx  = new Date().getDay()
  const todayKey  = DAY_IDX[todayIdx]

  const requestedDay = searchParams.day || todayKey
  const requestedIdx = DAY_IDX.indexOf(requestedDay)

  const activeDay = requestedIdx > todayIdx ? todayKey : requestedDay

  const contents = await getDailyContent(activeDay)

  return (
    <DailyPageClient
      contents={contents}
      activeDay={activeDay}
      todayKey={todayKey}
      todayIdx={todayIdx}
    />
  )
}