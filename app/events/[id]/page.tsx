import { createServerSupabaseClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { Calendar, MapPin, Clock, Radio, ArrowLeft, Tag } from 'lucide-react'
import Link from 'next/link'
import type { Event } from '@/lib/supabase'
import type { Metadata } from 'next'

interface Props { params: { id: string } }

async function getEvent(slug: string): Promise<Event | null> {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEvent(params.id)
  if (!event) return { title: 'Event Not Found' }
  return {
    title: event.title,
    description: event.description || `MCAN Oyo State event: ${event.title}`,
    openGraph: {
      images: event.image_url ? [event.image_url] : [],
    },
  }
}

export default async function EventDetailPage({ params }: Props) {
  const event = await getEvent(params.id)
  if (!event) notFound()

  const date = new Date(event.event_date)
  const isPast = date < new Date()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-700 font-body mb-6 transition-colors">
        <ArrowLeft size={15} /> Back to Home
      </Link>

      <article className="card overflow-hidden">
        {/* Image */}
        {event.image_url && (
          <div className="relative h-56 sm:h-72 overflow-hidden">
            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
            {event.is_live && (
              <div className="absolute top-4 left-4">
                <span className="live-badge text-sm px-3 py-1.5">
                  <span className="live-dot" /> LIVE NOW
                </span>
              </div>
            )}
            {isPast && (
              <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full font-body">
                Past Event
              </div>
            )}
          </div>
        )}

        <div className="p-6 sm:p-8">
          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {event.tags.map(tag => (
                <span key={tag} className="badge-primary flex items-center gap-1">
                  <Tag size={10} /> {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary-800 mb-5 leading-tight">
            {event.title}
          </h1>

          {/* Meta */}
          <div className="grid sm:grid-cols-2 gap-3 mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2.5 text-sm text-gray-600 font-body">
              <Calendar size={16} className="text-gold-500" />
              <span>{format(date, 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-600 font-body">
              <Clock size={16} className="text-gold-500" />
              <span>{format(date, 'h:mm a')}{event.end_date ? ` – ${format(new Date(event.end_date), 'h:mm a')}` : ''}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2.5 text-sm text-gray-600 font-body">
                <MapPin size={16} className="text-gold-500" />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <div className="prose max-w-none font-body text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {event.description}
            </div>
          )}

          {/* Live link */}
          {event.is_live && event.live_link && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm font-semibold text-red-700 mb-2 font-body">This event is live!</p>
              <a
                href={event.live_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 btn-primary text-sm"
                style={{ backgroundColor: '#ef4444' }}
              >
                <Radio size={15} /> Join Live Stream
              </a>
            </div>
          )}
        </div>
      </article>

      {/* Back */}
      <div className="mt-8 text-center">
        <Link href="/" className="btn-outline text-sm">
          ← View All Events
        </Link>
      </div>
    </div>
  )
}
