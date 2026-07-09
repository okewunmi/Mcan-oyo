// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import DailyContentCard from '@/components/DailyContent'
// import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
// import type { DailyContent } from '@/lib/supabase'

// const DAYS = [
//   { key: 'monday',    label: 'Monday',    topic: 'Hadith',       color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
//   { key: 'tuesday',   label: 'Tuesday',   topic: 'Azkar',        color: 'bg-teal-50 text-teal-700 border-teal-200' },
//   { key: 'wednesday', label: 'Wednesday', topic: 'Tawheed',      color: 'bg-blue-50 text-blue-700 border-blue-200' },
//   { key: 'thursday',  label: 'Thursday',  topic: 'Fiqh',         color: 'bg-amber-50 text-amber-700 border-amber-200' },
//   { key: 'friday',    label: 'Friday',    topic: "Jumu'ah",      color: 'bg-green-50 text-green-700 border-green-200' },
//   { key: 'saturday',  label: 'Saturday',  topic: 'Companions',   color: 'bg-purple-50 text-purple-700 border-purple-200' },
//   { key: 'sunday',    label: 'Sunday',    topic: "Qur'an Story", color: 'bg-rose-50 text-rose-700 border-rose-200' },
// ]

// const DAY_IDX = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']

// interface Props {
//   contents: DailyContent[]
//   activeDay: string
//   todayKey: string
//   todayIdx: number
// }

// export default function DailyPageClient({ contents, activeDay, todayKey, todayIdx }: Props) {
//   const router = useRouter()
//   const [postIndex, setPostIndex] = useState(0)   // which post within the day

//   const activeDayIdx  = DAY_IDX.indexOf(activeDay)
//   const dayInfo       = DAYS.find(d => d.key === activeDay)
//   const currentPost   = contents[postIndex] ?? null

//   // ── Day navigation ──────────────────────────────────────
//   function goToDay(dayKey: string) {
//     setPostIndex(0)
//     router.push(`/daily?day=${dayKey}`)
//   }

//   const canGoPrevDay = activeDayIdx > 0
//   // Cannot go forward past today
//   const canGoNextDay = activeDayIdx < todayIdx

//   const prevDayKey = canGoPrevDay ? DAY_IDX[activeDayIdx - 1] : null
//   const nextDayKey = canGoNextDay ? DAY_IDX[activeDayIdx + 1] : null

//   // ── Post navigation within the day ──────────────────────
//   const canGoPrevPost = postIndex < contents.length - 1
//   const canGoNextPost = postIndex > 0

//   return (
//     <div>
//       <section className="islamic-bg-dark py-14 px-4 text-center">
//         <span className="section-label text-gold-300">Spiritual Nourishment</span>
//         <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-3 mb-3">Daily Content</h1>
//         <p className="text-green-200 font-body max-w-xl mx-auto text-sm leading-relaxed">
//           New Islamic content every day — from authorised Sunni scholar sources.
//         </p>
//       </section>

//       <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

//         {/* ── Day tabs ── */}
//         <div className="flex gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
//           {DAYS.map(({ key, label, topic, color }, i) => {
//             const dayOrder = DAY_IDX.indexOf(key)
//             const isFuture = dayOrder > todayIdx
//             return (
//               <button
//                 key={key}
//                 disabled={isFuture}
//                 onClick={() => !isFuture && goToDay(key)}
//                 className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-body font-medium border transition-all ${
//                   isFuture
//                     ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
//                     : activeDay === key
//                     ? color + ' font-semibold'
//                     : 'bg-white text-gray-600 border-gray-200 hover:border-primary-200 hover:text-primary-700'
//                 }`}
//               >
//                 <span className="block text-xs opacity-70">{label}</span>
//                 <span className="block">{topic}</span>
//                 {key === todayKey && (
//                   <span className="block text-xs mt-0.5 text-gold-500 font-semibold">Today</span>
//                 )}
//               </button>
//             )
//           })}
//         </div>

//         {/* ── Content ── */}
//         {currentPost ? (
//           <div className="space-y-5">
//             {/* Post counter */}
//             {contents.length > 1 && (
//               <div className="flex items-center justify-between px-1">
//                 <p className="text-xs text-gray-400 font-body">
//                   Post {postIndex + 1} of {contents.length} for {dayInfo?.label}
//                 </p>
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => setPostIndex(i => i + 1)}
//                     disabled={!canGoPrevPost}
//                     className="flex items-center gap-1 text-xs text-primary-600 disabled:text-gray-300 disabled:cursor-not-allowed font-body hover:text-primary-800 transition-colors"
//                   >
//                     <ChevronLeft size={14} /> Prev post
//                   </button>
//                   <span className="text-gray-300">|</span>
//                   <button
//                     onClick={() => setPostIndex(i => i - 1)}
//                     disabled={!canGoNextPost}
//                     className="flex items-center gap-1 text-xs text-primary-600 disabled:text-gray-300 disabled:cursor-not-allowed font-body hover:text-primary-800 transition-colors"
//                   >
//                     Next post <ChevronRight size={14} />
//                   </button>
//                 </div>
//               </div>
//             )}

//             <DailyContentCard content={currentPost} expanded />

//             {/* ── Day navigation arrows ── */}
//             <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//               <button
//                 onClick={() => prevDayKey && goToDay(prevDayKey)}
//                 disabled={!canGoPrevDay}
//                 className="flex items-center gap-2 text-sm font-body font-medium text-primary-600 disabled:text-gray-300 disabled:cursor-not-allowed hover:text-primary-800 transition-colors"
//               >
//                 <ChevronLeft size={16} />
//                 {prevDayKey
//                   ? DAYS.find(d => d.key === prevDayKey)?.label
//                   : 'Previous'}
//               </button>

//               <span className="text-xs text-gray-400 font-body">
//                 {dayInfo?.label} — {dayInfo?.topic}
//               </span>

//               {canGoNextDay ? (
//                 <button
//                   onClick={() => nextDayKey && goToDay(nextDayKey)}
//                   className="flex items-center gap-2 text-sm font-body font-medium text-primary-600 hover:text-primary-800 transition-colors"
//                 >
//                   {DAYS.find(d => d.key === nextDayKey)?.label}
//                   <ChevronRight size={16} />
//                 </button>
//               ) : (
//                 <span className="text-xs text-gray-400 font-body italic">
//                   {activeDay === todayKey ? "You're up to date" : ''}
//                 </span>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div className="text-center py-20 card p-10">
//             <BookOpen size={40} className="text-gray-200 mx-auto mb-4" />
//             <h3 className="font-display text-xl text-gray-500 mb-2">
//               No content for {dayInfo?.label} yet
//             </h3>
//             <p className="text-sm text-gray-400 font-body">Check back soon.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DailyContentCard from '@/components/DailyContent'
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import type { DailyContent } from '@/lib/supabase'

const DAYS = [
  { key: 'monday',    label: 'Monday',    topic: 'Hadith',       color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { key: 'tuesday',   label: 'Tuesday',   topic: 'Azkar',        color: 'bg-teal-50 text-teal-700 border-teal-200' },
  { key: 'wednesday', label: 'Wednesday', topic: 'Tawheed',      color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { key: 'thursday',  label: 'Thursday',  topic: 'Fiqh',         color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { key: 'friday',    label: 'Friday',    topic: "Jumu'ah",      color: 'bg-green-50 text-green-700 border-green-200' },
  { key: 'saturday',  label: 'Saturday',  topic: 'Companions',   color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { key: 'sunday',    label: 'Sunday',    topic: "Qur'an Story", color: 'bg-rose-50 text-rose-700 border-rose-200' },
]

const DAY_IDX = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']

interface Props {
  contents: DailyContent[]
  activeDay: string
  todayKey: string
  todayIdx: number
}

export default function DailyPageClient({ contents, activeDay, todayKey, todayIdx }: Props) {
  const router = useRouter()
  const [postIndex, setPostIndex] = useState(0)

  const activeDayIdx = DAY_IDX.indexOf(activeDay)
  const dayInfo      = DAYS.find(d => d.key === activeDay)
  const currentPost  = contents[postIndex] ?? null

  // ── Day navigation ───────────────────────────────────────
  function goToDay(dayKey: string) {
    setPostIndex(0)
    router.push(`/daily?day=${dayKey}`)
  }

  const canGoPrevDay = activeDayIdx > 0
  const canGoNextDay = activeDayIdx < todayIdx

  const prevDayKey = canGoPrevDay ? DAY_IDX[activeDayIdx - 1] : null
  const nextDayKey = canGoNextDay ? DAY_IDX[activeDayIdx + 1] : null

  // ── Post navigation within the day ──────────────────────
  const canGoPrevPost = postIndex > 0
  const canGoNextPost = postIndex < contents.length - 1

  // week_number is injected by getAllWeeksForDay() in the server page
  const weekNumber = (currentPost as any)?.week_number ?? postIndex + 1

  return (
    <div>
      <section className="islamic-bg-dark py-14 px-4 text-center">
        <span className="section-label text-gold-300">Spiritual Nourishment</span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-3 mb-3">Daily Content</h1>
        <p className="text-green-200 font-body max-w-xl mx-auto text-sm leading-relaxed">
          New Islamic content every day — from authorised Sunni scholar sources.
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Day tabs ── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
          {DAYS.map(({ key, label, topic, color }) => {
            const dayOrder = DAY_IDX.indexOf(key)
            const isFuture = dayOrder > todayIdx
            return (
              <button
                key={key}
                disabled={isFuture}
                onClick={() => !isFuture && goToDay(key)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-body font-medium border transition-all ${
                  isFuture
                    ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                    : activeDay === key
                    ? color + ' font-semibold'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-200 hover:text-primary-700'
                }`}
              >
                <span className="block text-xs opacity-70">{label}</span>
                <span className="block">{topic}</span>
                {key === todayKey && (
                  <span className="block text-xs mt-0.5 text-gold-500 font-semibold">Today</span>
                )}
              </button>
            )
          })}
        </div>

        {/* ── Content ── */}
        {currentPost ? (
          <div className="space-y-5">

            {/* Week counter + post navigation */}
            {contents.length > 1 && (
              <div className="flex items-center justify-between px-1">
                <p className="text-xs text-gray-400 font-body">
                  Week {weekNumber} of 52 · {dayInfo?.topic}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPostIndex(i => i - 1)}
                    disabled={!canGoPrevPost}
                    className="flex items-center gap-1 text-xs text-primary-600 disabled:text-gray-300 disabled:cursor-not-allowed font-body hover:text-primary-800 transition-colors"
                  >
                    <ChevronLeft size={14} /> Prev week
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => setPostIndex(i => i + 1)}
                    disabled={!canGoNextPost}
                    className="flex items-center gap-1 text-xs text-primary-600 disabled:text-gray-300 disabled:cursor-not-allowed font-body hover:text-primary-800 transition-colors"
                  >
                    Next week <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            <DailyContentCard content={currentPost} expanded />

            {/* ── Day navigation arrows ── */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                onClick={() => prevDayKey && goToDay(prevDayKey)}
                disabled={!canGoPrevDay}
                className="flex items-center gap-2 text-sm font-body font-medium text-primary-600 disabled:text-gray-300 disabled:cursor-not-allowed hover:text-primary-800 transition-colors"
              >
                <ChevronLeft size={16} />
                {prevDayKey ? DAYS.find(d => d.key === prevDayKey)?.label : 'Previous'}
              </button>

              <span className="text-xs text-gray-400 font-body">
                {dayInfo?.label} — {dayInfo?.topic}
              </span>

              {canGoNextDay ? (
                <button
                  onClick={() => nextDayKey && goToDay(nextDayKey)}
                  className="flex items-center gap-2 text-sm font-body font-medium text-primary-600 hover:text-primary-800 transition-colors"
                >
                  {DAYS.find(d => d.key === nextDayKey)?.label}
                  <ChevronRight size={16} />
                </button>
              ) : (
                <span className="text-xs text-gray-400 font-body italic">
                  {activeDay === todayKey ? "You're up to date" : ''}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 card p-10">
            <BookOpen size={40} className="text-gray-200 mx-auto mb-4" />
            <h3 className="font-display text-xl text-gray-500 mb-2">
              No content for {dayInfo?.label} yet
            </h3>
            <p className="text-sm text-gray-400 font-body">Check back soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}