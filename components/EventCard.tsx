import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Radio, Clock } from 'lucide-react'
import { format, isPast } from 'date-fns'
import type { Event } from '@/lib/supabase'

interface EventCardProps {
  event: Event
  featured?: boolean
}

export default function EventCard({ event, featured = false }: EventCardProps) {
  const date    = new Date(event.event_date)
  const isPastEvent = isPast(date)

  if (featured) {
    return (
      <Link href={`/events/${event.slug}`} className="block group">
        <article className="card overflow-hidden">
          {/* Image */}
          <div className="relative h-52 sm:h-64 overflow-hidden bg-primary-100">
            {event.image_url ? (
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-700 to-primary-900">
                <Calendar size={40} className="text-white/40" />
              </div>
            )}
            {event.is_live && (
              <div className="absolute top-3 left-3">
                <span className="live-badge">
                  <span className="live-dot" />
                  LIVE
                </span>
              </div>
            )}
            {isPastEvent && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full font-body font-medium">Past Event</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {event.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="badge-primary">{tag}</span>
                ))}
              </div>
            )}
            <h3 className="font-display text-xl font-semibold text-primary-800 group-hover:text-primary-600 transition-colors line-clamp-2 mb-3">
              {event.title}
            </h3>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-sm text-gray-500 font-body">
                <Calendar size={14} className="text-gold-500 flex-shrink-0" />
                <span>{format(date, 'EEEE, MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 font-body">
                <Clock size={14} className="text-gold-500 flex-shrink-0" />
                <span>{format(date, 'h:mm a')}</span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2 text-sm text-gray-500 font-body">
                  <MapPin size={14} className="text-gold-500 flex-shrink-0" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
              )}
            </div>

            {event.description && (
              <p className="text-sm text-gray-600 mt-3 line-clamp-2 font-body leading-relaxed">
                {event.description}
              </p>
            )}

            <div className="mt-4 flex items-center justify-between">
              <span className="text-primary-700 text-sm font-semibold font-body group-hover:text-primary-500 transition-colors">
                Read more →
              </span>
              {event.is_live && event.live_link && (
                <a
                  href={event.live_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-xs bg-red-500 text-white px-3 py-1.5 rounded-full hover:bg-red-600 transition-colors"
                >
                  <Radio size={11} /> Watch Live
                </a>
              )}
            </div>
          </div>
        </article>
      </Link>
    )
  }

  // Compact list variant
  return (
    <Link href={`/events/${event.slug}`} className="block group">
      <article className="flex gap-4 py-4 border-b border-gray-100 hover:border-primary-200 transition-colors">
        <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-primary-50">
          {event.image_url ? (
            <img src={event.image_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary-100">
              <Calendar size={20} className="text-primary-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {event.is_live && <span className="live-badge text-xs">LIVE</span>}
            {isPastEvent && <span className="text-xs text-gray-400 font-body">Past</span>}
          </div>
          <h4 className="font-display text-base font-semibold text-primary-800 group-hover:text-primary-600 transition-colors line-clamp-1">
            {event.title}
          </h4>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-gray-500 font-body flex items-center gap-1">
              <Calendar size={11} /> {format(date, 'MMM d, yyyy')}
            </span>
            {event.location && (
              <span className="text-xs text-gray-500 font-body flex items-center gap-1">
                <MapPin size={11} /> {event.location}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
