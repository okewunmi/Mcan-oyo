import { createServerSupabaseClient } from '@/lib/supabase-server'
import EventCard from '@/components/EventCard'
import { Calendar } from 'lucide-react'
import type { Event } from '@/lib/supabase'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Events',
  description: 'All MCAN Oyo State events — upcoming and past.',
}


async function getEvents() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .order('event_date', { ascending: false })
  return (data || []) as Event[]
}


export default async function EventsPage() {
  const events = await getEvents()

  const upcoming = events.filter(e => new Date(e.event_date) >= new Date())
  const past     = events.filter(e => new Date(e.event_date) <  new Date())

  return (
    <div>
      <section className="islamic-bg-dark py-14 px-4 text-center">
        <span className="section-label text-gold-300">All Events</span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-3 mb-3">
          Events
        </h1>
        <p className="text-green-200 font-body max-w-xl mx-auto text-sm">
          Upcoming and past MCAN Oyo State programmes and activities.
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">

        {/* Upcoming */}
        <section>
          <div className="mb-6">
            <span className="section-label">Coming Up</span>
            <h2 className="section-title mt-1">Upcoming Events</h2>
          </div>
          {upcoming.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcoming.map(e => <EventCard key={e.id} event={e} featured />)}
            </div>
          ) : (
            <div className="card p-10 text-center border border-dashed border-gray-200">
              <Calendar size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-body text-sm">No upcoming events. Check back soon.</p>
            </div>
          )}
        </section>

        {/* Past */}
        {past.length > 0 && (
          <section>
            <div className="mb-6">
              <span className="section-label">Archive</span>
              <h2 className="section-title mt-1">Past Events</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {past.map(e => <EventCard key={e.id} event={e} featured />)}
            </div>
          </section>
        )}

        {events.length === 0 && (
          <div className="text-center py-20">
            <Calendar size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-body">No events posted yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}