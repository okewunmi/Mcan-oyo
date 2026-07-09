import { createServerSupabaseClient } from '@/lib/supabase-server'
import EventCard from '@/components/EventCard'
import DailyContentCard from '@/components/DailyContent'
import ProjectCard, { type Project } from '@/components/ProjectCard'
import Link from 'next/link'
import { Calendar, BookOpen, ChevronRight, Heart, Star, Hammer } from 'lucide-react'
import { format } from 'date-fns'
import type { Event, DailyContent } from '@/lib/supabase'
import dailyContentData from '@/data/daily-contents.json'
import { getCurrentWeekNumber } from '@/lib/get-current-week'
const DAY_NAMES = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']

// async function getData() {
//   const supabase = createServerSupabaseClient()
//   const today = DAY_NAMES[new Date().getDay()]

//   const [eventsRes, dailyRes, projectsRes] = await Promise.all([
//     supabase.from('events').select('*').eq('is_published', true)
//       .order('event_date', { ascending: false }).limit(6),
//     supabase.from('daily_content').select('*').eq('day_of_week', today)
//       .eq('is_published', true).limit(1),
//     supabase.from('projects').select('*').eq('is_published', true)
//       .order('created_at', { ascending: false }).limit(3),
//   ])

//   const dailyFromJSON = (dailyContentData as any)[today]?.[0] ?? null

//   return {
//     events:   (eventsRes.data   || []) as Event[],
//     daily:    (dailyRes.data?.[0] || dailyFromJSON) as DailyContent | null,
//     projects: (projectsRes.data  || []) as Project[],
//     today,
//   }
// }

async function getData() {
  const supabase = createServerSupabaseClient()
  const today = DAY_NAMES[new Date().getDay()]
  const weekNumber = getCurrentWeekNumber()
  // const weekKey = `week_${weekNumber}` // e.g. "week_7"
const weekKey = `week_${getCurrentWeekNumber()}`


  const jsonContent = (dailyContentData as any)
  
const dailyFromJSON = (dailyContentData as any)
  .content?.[weekKey]?.[today]?.[0] ?? null


  const [eventsRes, dailyRes, projectsRes] = await Promise.all([
    supabase.from('events').select('*').eq('is_published', true)
      .order('event_date', { ascending: false }).limit(6),
    supabase.from('daily_content').select('*').eq('day_of_week', today)
      .eq('is_published', true).limit(1),
    supabase.from('projects').select('*').eq('is_published', true)
      .order('created_at', { ascending: false }).limit(3),
  ])

  return {
    events:   (eventsRes.data   || []) as Event[],
    // Supabase DB takes priority; JSON is the fallback
    daily:    (dailyRes.data?.[0] || dailyFromJSON) as DailyContent | null,
    projects: (projectsRes.data  || []) as Project[],
    today,
    weekNumber,
  }
}

export default async function HomePage() {
  // const { events, daily, projects, today } = await getData()
const { events, daily, projects, today, weekNumber } = await getData()
  const upcomingEvents = events.filter(e => new Date(e.event_date) >= new Date()).slice(0, 4)
  const pastEvents     = events.filter(e => new Date(e.event_date) <  new Date()).slice(0, 3)

  return (
    <div>
      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden islamic-bg-dark">
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-cream rounded-t-[3rem] z-10" />
        <div className="relative z-0 max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <p className="font-arabic text-gold-300 text-2xl sm:text-3xl mb-6 leading-loose">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <div className="w-20 h-20 mx-auto mb-6 rounded-full border-4 border-gold-400/60 overflow-hidden bg-white/10">
            <img src="/images/logo.jpg" alt="MCAN Oyo" className="w-full h-full object-cover" />
          </div>
          <span className="section-label text-gold-300">Oyo State Chapter</span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-3 mb-4 leading-tight">
            Muslim Corpers'<br />Association of Nigeria
          </h1>
          <p className="font-body text-green-200 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Empowering Muslim corps members across all 33 local governments of Oyo State.
            Serving <span className="text-gold-300 font-semibold">Islam</span> through the Nation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="btn-gold text-sm px-6 py-3">Register Now</Link>
            <Link href="/about" className="btn-outline text-sm px-6 py-3 border-white/40 hover:bg-white/10 hover:border-white">
              Learn About MCAN
            </Link>
            <Link href="/donate" className="flex items-center gap-2 text-sm text-gold-300 hover:text-gold-200 font-body transition-colors">
              <Heart size={15} /> Donate
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Stats ─────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-3 gap-4 text-center">
          {[
            { num: '33',  label: 'Local Governments' },
            { num: '3',   label: 'Batches per Year'  },
            { num: '45+', label: 'Years of Service'  },
          ].map(({ num, label }) => (
            <div key={label}>
              <p className="font-display text-3xl sm:text-4xl font-bold text-primary-700">{num}</p>
              <p className="text-xs sm:text-sm text-gray-500 font-body mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">

        {/* ─── Events + Daily Content ──────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Events — 2/3 */}
          <div className="lg:col-span-2 space-y-10">
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="section-label">What's Coming</span>
                  <h2 className="section-title mt-1">Upcoming Events</h2>
                </div>
                <Link href="/events" className="text-sm text-primary-600 font-body font-medium hover:text-primary-800 flex items-center gap-1">
                  All events <ChevronRight size={15} />
                </Link>
              </div>
              {upcomingEvents.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-5">
                  {upcomingEvents.map(e => <EventCard key={e.id} event={e} featured />)}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-10 text-center border border-dashed border-gray-200">
                  <Calendar size={32} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-body text-sm">No upcoming events. Check back soon.</p>
                </div>
              )}
            </section>

            {pastEvents.length > 0 && (
              <section>
                <div className="mb-5">
                  <span className="section-label">Archive</span>
                  <h2 className="section-title mt-1">Past Events</h2>
                </div>
                <div className="card p-1">
                  {pastEvents.map(e => <EventCard key={e.id} event={e} />)}
                  <div className="px-5 py-3">
                    <Link href="/events" className="text-sm text-primary-600 font-body hover:text-primary-800 flex items-center gap-1">
                      View all events <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Daily Content — 1/3 */}
          <div className="space-y-6">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <span className="section-label">Spiritual Nourishment</span>
                  <h2 className="font-display text-2xl font-semibold text-primary-800 mt-1">
                    {format(new Date(), 'EEEE')}
                  </h2>
                   
                </div>
                <Link href="/daily" className="text-sm text-primary-600 font-body font-medium hover:text-primary-800 flex items-center gap-1">
                  Archive <ChevronRight size={15} />
                </Link>
              </div>
              {daily ? <DailyContentCard content={daily} /> : (
                <div className="card p-8 text-center">
                  <BookOpen size={28} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-body">Today's content coming soon.</p>
                  <Link href="/daily" className="text-sm text-primary-600 font-body mt-3 inline-block hover:underline">Browse all →</Link>
                </div>
              )}
            </div>

            {/* Weekly schedule */}
            {/* <div className="card p-5">
              <h3 className="font-display text-lg font-semibold text-primary-800 mb-4">Weekly Schedule</h3>
              <ul className="space-y-2">
                {[
                  { day: 'Monday',    topic: 'Hadith',          color: 'bg-emerald-100 text-emerald-700' },
                  { day: 'Tuesday',   topic: 'Azkar',           color: 'bg-teal-100 text-teal-700' },
                  { day: 'Wednesday', topic: 'Tawheed',         color: 'bg-blue-100 text-blue-700' },
                  { day: 'Thursday',  topic: 'Fiqh',            color: 'bg-amber-100 text-amber-700' },
                  { day: 'Friday',    topic: "Jumu'ah",         color: 'bg-green-100 text-green-700' },
                  { day: 'Saturday',  topic: 'Companions',      color: 'bg-purple-100 text-purple-700' },
                  { day: 'Sunday',    topic: "Qur'an Story",    color: 'bg-rose-100 text-rose-700' },
                ].map(({ day, topic, color }) => (
                  <li key={day} className={`flex items-center justify-between rounded-lg px-3 py-2 ${today === day.toLowerCase() ? 'bg-primary-50 border border-primary-200' : ''}`}>
                    <span className="text-sm font-body text-gray-700 font-medium">
                      {today === day.toLowerCase() && <Star size={12} className="text-gold-500 inline mr-1" />}
                      {day}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold font-body ${color}`}>{topic}</span>
                  </li>
                ))}
              </ul>
            </div> */}

            {/* Donate */}
            {/* <div className="card-2 p-5 bg-gradient-to-br from-gold-500 to-gold-600 border-0">
              <Heart size={24} className="text-white mb-3" />
              <h3 className="font-display text-xl font-semibold text-white mb-2">Support MCAN Oyo</h3>
              <p className="text-sm text-white/90 font-body mb-4 leading-relaxed">
                Help sustain mosques, Arabic schools &amp; da'wah activities.
              </p>
              <Link href="/donate" className="block w-full text-center bg-white text-gold-700 py-2.5 rounded-lg text-sm font-semibold font-body hover:bg-gray-50 transition-colors">
                Donate Now
              </Link>
            </div> */}
          </div>
        </div>

        {/* ─── Projects Preview ─────────────────────────────── */}
        {projects.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="section-label">Community Development</span>
                <h2 className="section-title mt-1">Our Projects</h2>
              </div>
              <Link href="/projects" className="text-sm text-primary-600 font-body font-medium hover:text-primary-800 flex items-center gap-1">
                All projects <ChevronRight size={15} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}