import type { Metadata } from 'next'
import { ChevronDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FAQs',
  description: 'Frequently asked questions about MCAN Oyo State.',
}

const FAQS = [
  {
    category: 'About MCAN',
    items: [
      {
        q: 'What is MCAN?',
        a: 'The Muslim Corpers Association of Nigeria (MCAN) is a faith-based organization for Muslim members of the National Youth Service Corps (NYSC). It provides spiritual guidance, welfare support, and a platform for personal and professional development.',
      },
      {
        q: 'Who can join MCAN?',
        a: 'MCAN is open to all Muslim corps members serving in Oyo State, regardless of tribe or background.',
      },
    ],
  },
  {
    category: 'Membership & Participation',
    items: [
      {
        q: 'How do I become a member of MCAN?',
        a: 'You can join by registering at the camp during orientation, or at the MCAN office after posting to your Place of Primary Assignment (PPA). You can also register directly on this website.',
      },
      {
        q: 'Is there a membership fee?',
        a: 'Membership contributions are usually minimal, aimed at supporting activities and welfare programs.',
      },
      {
        q: 'Can I participate if I join late?',
        a: 'Yes, you can join MCAN at any time during your service year and still benefit from its programs.',
      },
    ],
  },
  {
    category: 'Programs & Activities',
    items: [
      {
        q: 'What kind of activities does MCAN organize?',
        a: 'MCAN organizes Islamic lectures and reminders, skills acquisition programs, welfare support initiatives, community development services (CDS), Ramadan and Eid programs, and networking and mentorship opportunities.',
      },
      {
        q: 'Are there programs for sisters specifically?',
        a: 'Yes, MCAN organizes dedicated programs addressing the needs of Muslim sisters, including personal development and Islamic guidance sessions.',
      },
    ],
  },
  {
    category: 'Welfare & Support',
    items: [
      {
        q: 'Does MCAN provide welfare support?',
        a: 'Yes, MCAN supports members through emergency assistance, medical support where possible, and visitations and moral support.',
      },
      {
        q: 'What should I do if I need help during service?',
        a: 'Reach out to the MCAN executives or welfare unit. They are responsible for coordinating support for members. You can find their contacts on the LGI & MCLO page.',
      },
    ],
  },
  {
    category: 'Religious & Spiritual Development',
    items: [
      {
        q: 'What spiritual benefits does MCAN offer?',
        a: "MCAN provides regular Islamic reminders, Qur'an study circles, guidance on practicing Islam during service, and access to scholars and mentors.",
      },
    ],
  },
  {
    category: 'Leadership & Structure',
    items: [
      {
        q: 'How is MCAN structured?',
        a: 'MCAN operates at national, state, and local government levels. Each level has appointed or elected executives overseeing activities.',
      },
      {
        q: 'Can members take up leadership roles?',
        a: 'Yes, members can serve in various capacities at state and local levels, contributing to the growth and administration of MCAN.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div>
      {/* Hero */}
      <section className="islamic-bg-dark py-14 px-4 text-center">
        <span className="section-label text-gold-300">Got Questions?</span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-3 mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-green-200 font-body max-w-xl mx-auto text-sm leading-relaxed">
          Everything you need to know about MCAN Oyo State.
          Can't find your answer?{' '}
          <a href="/contact" className="text-gold-300 hover:text-gold-200 underline">
            Contact us
          </a>.
        </p>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 space-y-10">

        {FAQS.map(({ category, items }) => (
          <section key={category}>
            {/* Category header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-200" />
              <h2 className="font-display text-xl font-semibold text-primary-800 whitespace-nowrap">
                {category}
              </h2>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-200" />
            </div>

            {/* FAQ items */}
            <div className="space-y-3">
              {items.map(({ q, a }) => (
                <details
                  key={q}
                  className="card group overflow-hidden"
                >
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none select-none hover:bg-primary-50 transition-colors">
                    <span className="font-body font-semibold text-gray-800 text-sm sm:text-base leading-snug">
                      {q}
                    </span>
                    <ChevronDown
                      size={18}
                      className="text-gold-500 flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
                    />
                  </summary>
                  <div className="px-5 pb-5 pt-1 border-t border-gray-100">
                    <p className="text-gray-600 font-body text-sm leading-relaxed">
                      {a}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}

        {/* Still have questions */}
        <div className="bg-primary-700 rounded-2xl p-8 text-center">
          <p className="font-arabic text-gold-300 text-xl leading-loose mb-2">
            وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ
          </p>
          <p className="text-green-200 text-xs font-body italic mb-6">
            "When My servants ask about Me, I am near." — Quran 2:186
          </p>
          <h3 className="font-display text-xl font-semibold text-white mb-2">
            Still have questions?
          </h3>
          <p className="text-green-200 font-body text-sm mb-5">
            Our executives are happy to help. Reach out anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/contact" className="btn-gold text-sm px-6 py-2.5">
              Contact Us
            </a>
            <a href="/lgi" className="btn-outline text-sm px-6 py-2.5 border-white/40 text-white hover:bg-white/10 hover:border-white">
              Find Your MCLO
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}