import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Phone, Mail, Users } from 'lucide-react'
import type { Executive } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Executives',
  description: 'Meet the current executives of MCAN Oyo State chapter.',
}

async function getExecutives() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.from('executives').select('*').order('sort_order')
  return (data || []) as Executive[]
}

export default async function ExecutivesPage() {
  const executives = await getExecutives()
  const ameer    = executives[0]
  const others   = executives.slice(1)

  return (
    <div>
      <section className="islamic-bg-dark py-14 px-4 text-center">
        <span className="section-label text-gold-300">Leadership</span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-3 mb-3">
          Current Executives
        </h1>
        <p className="text-green-200 font-body max-w-xl mx-auto text-sm leading-relaxed">
          Elected representatives serving MCAN Oyo State corpers.
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {executives.length === 0 ? (
          <div className="text-center py-20">
            <Users size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-body">Executive list will be updated soon.</p>
          </div>
        ) : (
          <>
            {/* Ameer (first executive, featured) */}
            {ameer && (
              <div className="mb-10 flex justify-center">
                <div className="card p-8 text-center max-w-sm w-full">
                  <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden bg-primary-100 border-4 border-gold-200">
                    {ameer.photo_url ? (
                      <img src={ameer.photo_url} alt={ameer.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl font-display font-bold text-primary-400">
                          {ameer.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="badge-gold mb-2 inline-block">{ameer.position}</span>
                  <h2 className="font-display text-2xl font-semibold text-primary-800 mt-1 mb-1">{ameer.name}</h2>
                  {ameer.batch && <p className="text-sm text-gray-400 font-body mb-3">Batch {ameer.batch}</p>}
                  <div className="flex flex-col gap-2 items-center">
                    {ameer.phone && (
                      <a href={`tel:${ameer.phone}`} className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800 font-body transition-colors">
                        <Phone size={14} /> {ameer.phone}
                      </a>
                    )}
                    {ameer.email && (
                      <a href={`mailto:${ameer.email}`} className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800 font-body transition-colors">
                        <Mail size={14} /> {ameer.email}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Others grid */}
            {others.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {others.map((exec) => (
                  <ExecCard key={exec.id} exec={exec} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function ExecCard({ exec }: { exec: Executive }) {
  return (
    <div className="card p-5 flex gap-4">
      <div className="w-14 h-14 rounded-full overflow-hidden bg-primary-50 border-2 border-primary-100 flex-shrink-0">
        {exec.photo_url ? (
          <img src={exec.photo_url} alt={exec.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-lg font-display font-bold text-primary-400">{exec.name.charAt(0)}</span>
          </div>
        )}
      </div>
      <div className="min-w-0">
        <span className="badge-primary text-xs mb-1 inline-block">{exec.position}</span>
        <h3 className="font-display text-base font-semibold text-primary-800 leading-tight truncate">{exec.name}</h3>
        {exec.batch && <p className="text-xs text-gray-400 font-body mb-2">Batch {exec.batch}</p>}
        <div className="flex flex-col gap-1">
          {exec.phone && (
            <a href={`tel:${exec.phone}`} className="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-800 font-body">
              <Phone size={11} /> {exec.phone}
            </a>
          )}
          {exec.email && (
            <a href={`mailto:${exec.email}`} className="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-800 font-body truncate">
              <Mail size={11} /> {exec.email}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
