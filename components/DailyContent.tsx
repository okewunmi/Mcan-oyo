'use client'

import { BookOpen, Quote, Star, Info, Link2, User } from 'lucide-react'
import type { DailyContent } from '@/lib/supabase'

interface DailyContentCardProps {
  content: DailyContent
  expanded?: boolean
}

const dayLabels: Record<string, string> = {
  monday: 'Hadith of the Day',
  tuesday: 'Azkar of the Day',
  wednesday: "Today's Tawheed",
  thursday: "Today's Fiqh",
  friday: "Jumu'ah Special",
  saturday: "Companions' Story",
  sunday: "Qur'an Story",
}

const typeColors: Record<string, string> = {
  hadith:         'bg-emerald-50 border-emerald-200 text-emerald-800',
  azkar:          'bg-teal-50 border-teal-200 text-teal-800',
  tawheed:        'bg-blue-50 border-blue-200 text-blue-800',
  fiqh:           'bg-amber-50 border-amber-200 text-amber-800',
  jumuah:         'bg-green-50 border-green-200 text-green-800',
  prophet_story:  'bg-purple-50 border-purple-200 text-purple-800',
  quran_story:    'bg-rose-50 border-rose-200 text-rose-800',
}

export default function DailyContentCard({ content, expanded = false }: DailyContentCardProps) {
  const label = dayLabels[content.day_of_week] || 'Today\'s Content'
  const colorClass = typeColors[content.content_type] || typeColors.hadith

  return (
    <article className="card overflow-hidden">
      {/* Header */}
      <div className="islamic-bg-dark px-6 py-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="section-label text-gold-300">{label}</span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold font-body border ${colorClass}`}>
            {content.content_type.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </span>
        </div>
        <h2 className="font-display text-white text-xl font-semibold mt-2 leading-tight">
          {content.title}
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Arabic text */}
        {content.arabic_text && (
          <div className="bg-primary-50 rounded-xl p-5 border border-primary-100">
            <p className="arabic-text-lg leading-loose">{content.arabic_text}</p>
            {content.transliteration && (
              <p className="text-center text-sm text-gray-500 italic mt-3 font-body">
                {content.transliteration}
              </p>
            )}
          </div>
        )}

        {/* English translation */}
        {content.english_text && (
          <div className="relative">
            <Quote size={20} className="text-gold-300 absolute -top-1 -left-1" />
            <p className="font-display text-lg text-gray-800 leading-relaxed pl-6 italic">
              {content.english_text}
            </p>
          </div>
        )}

        {/* Hadith specifics */}
        {content.reported_by && (
          <div className="flex gap-3 bg-gray-50 rounded-lg p-4">
            <User size={16} className="text-gold-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-body mb-1">
                Narrated By
              </p>
              <p className="text-sm text-gray-700 font-body">{content.reported_by}</p>
            </div>
          </div>
        )}

        {content.chain_of_narration && expanded && (
          <div className="flex gap-3 bg-gray-50 rounded-lg p-4">
            <Link2 size={16} className="text-primary-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-body mb-1">
                Chain of Narration (Isnad)
              </p>
              <p className="text-sm text-gray-700 font-body leading-relaxed">{content.chain_of_narration}</p>
            </div>
          </div>
        )}

        {/* Lesson */}
        {content.lesson && (
          <div className="border-l-4 border-primary-500 pl-4">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide font-body mb-2 flex items-center gap-1.5">
              <Star size={12} /> Lesson for Corps Members
            </p>
            <p className="text-sm text-gray-700 font-body leading-relaxed whitespace-pre-line">
              {content.lesson}
            </p>
          </div>
        )}

        {/* Benefits (Azkar) */}
        {content.benefits && (
          <div className="border-l-4 border-teal-400 pl-4">
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide font-body mb-2 flex items-center gap-1.5">
              <Star size={12} /> Benefits
            </p>
            <p className="text-sm text-gray-700 font-body leading-relaxed">{content.benefits}</p>
          </div>
        )}

        {/* Extra notes */}
        {content.extra_notes && expanded && (
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide font-body mb-2 flex items-center gap-1.5">
              <Info size={12} /> Notes & Q&amp;A
            </p>
            <p className="text-sm text-gray-700 font-body leading-relaxed whitespace-pre-line">
              {content.extra_notes}
            </p>
          </div>
        )}

        {/* Source */}
        {content.source && (
          <div className="flex items-start gap-2 pt-2 border-t border-gray-100">
            <BookOpen size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400 font-body italic">{content.source}</p>
          </div>
        )}
      </div>
    </article>
  )
}
