import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { MapPin, Phone, Users, Navigation, Building2 } from 'lucide-react'
import type { Lodge } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Lodges',
  description: 'Find MCAN Oyo State lodges across all local governments with addresses and directions.',
}

async function getLodges() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.from('lodges').select('*').order('lga')
  return (data || []) as Lodge[]
}

export default async function LodgesPage() {
  const lodges = await getLodges()

  return (
    <div>
      {/* Header */}
      <section className="islamic-bg-dark py-14 px-4 text-center">
        <span className="section-label text-gold-300">Find a Lodge</span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-3 mb-3">
          MCAN Lodges
        </h1>
        <p className="text-green-200 font-body max-w-xl mx-auto text-sm leading-relaxed">
          Locate MCAN lodges across Oyo State. Each lodge provides a safe haven for corps members 
          to observe prayers, study, and connect with fellow Muslim corpers.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {lodges.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {lodges.map((lodge) => (
              <LodgeCard key={lodge.id} lodge={lodge} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Building2 size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="font-display text-xl text-gray-500 mb-2">Lodge directory coming soon</h3>
            <p className="text-sm text-gray-400 font-body max-w-sm mx-auto">
              We're compiling lodge information. Contact your LGI or MCLO for the nearest lodge in your LGA.
            </p>
            <a href="/lgi" className="btn-primary mt-6 text-sm">
              Find Your MCLO
            </a>
          </div>
        )}

        {/* Tips */}
        <div className="mt-14 bg-primary-50 rounded-xl p-6 border border-primary-100">
          <h3 className="font-display text-xl font-semibold text-primary-800 mb-3">Lodge Guidelines</h3>
          <ul className="space-y-2">
            {[
              'Maintain cleanliness and observe proper Islamic etiquette at all times.',
              'Jama\'ah (congregational) Salah should be observed at the lodge mosque or nearest masjid.',
              'Report any maintenance issues to your MCLO promptly.',
              'New corps members should register with the lodge warden upon arrival.',
              'Lodge facilities are for the use of Muslim corps members and their guests only.',
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-sm text-gray-700 font-body">
                <span className="text-gold-500 mt-0.5">•</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function LodgeCard({ lodge }: { lodge: Lodge }) {
  const mapsUrl = lodge.google_maps_url ||
    (lodge.lat && lodge.lng
      ? `https://maps.google.com/maps?q=${lodge.lat},${lodge.lng}`
      : lodge.address
      ? `https://maps.google.com/maps?q=${encodeURIComponent(lodge.address + ', Oyo State, Nigeria')}`
      : null)

  return (
    <div className="card p-5 flex flex-col">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
          <Building2 size={20} className="text-primary-600" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-primary-800 leading-tight">{lodge.name}</h3>
          <span className="badge-primary text-xs">{lodge.lga}</span>
        </div>
      </div>

      <div className="space-y-2 flex-1">
        {lodge.address && (
          <div className="flex items-start gap-2 text-sm text-gray-600 font-body">
            <MapPin size={14} className="text-gold-500 flex-shrink-0 mt-0.5" />
            <span>{lodge.address}</span>
          </div>
        )}
        {lodge.landmark && (
          <div className="flex items-start gap-2 text-sm text-gray-500 font-body">
            <span className="w-3.5 flex-shrink-0" />
            <span className="italic">Near: {lodge.landmark}</span>
          </div>
        )}
        {lodge.contact_name && (
          <div className="flex items-center gap-2 text-sm text-gray-600 font-body">
            <Users size={14} className="text-gold-500 flex-shrink-0" />
            <span>{lodge.contact_name}</span>
          </div>
        )}
        {lodge.contact_phone && (
          <a
            href={`tel:${lodge.contact_phone}`}
            className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800 font-body transition-colors"
          >
            <Phone size={14} className="text-gold-500 flex-shrink-0" />
            {lodge.contact_phone}
          </a>
        )}
        {lodge.capacity && (
          <div className="flex items-center gap-2 text-sm text-gray-500 font-body">
            <Users size={14} className="text-gray-400 flex-shrink-0" />
            <span>Capacity: {lodge.capacity} persons</span>
          </div>
        )}
      </div>

      {mapsUrl && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-primary-200 text-primary-700 text-sm font-body font-medium hover:bg-primary-50 transition-colors"
        >
          <Navigation size={14} /> Get Directions
        </a>
      )}
    </div>
  )
}
