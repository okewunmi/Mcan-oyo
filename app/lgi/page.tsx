// import type { Metadata } from 'next'
// import { createServerSupabaseClient } from '@/lib/supabase-server'
// import { Phone, MapPin, Search } from 'lucide-react'
// import type { LGIContact } from '@/lib/supabase'

// export const metadata: Metadata = {
//   title: 'LGI & MCLO Contacts',
//   description: 'Local Government Inspectors and Muslim Community Liaison Officers for all 33 LGAs in Oyo State.',
// }

// async function getLGIContacts() {
//   const supabase = createServerSupabaseClient()
//   const { data } = await supabase
//     .from('lgi_contacts')
//     .select('*')
//     .order('sort_order')
//   return (data || []) as LGIContact[]
// }

// const zones = ['Ibadan Metro', 'Oyo Zone', 'Ogbomosho Zone', 'Saki Zone', 'Ibarapa Zone']

// export default async function LGIPage() {
//   const contacts = await getLGIContacts()

//   const grouped = zones.reduce<Record<string, LGIContact[]>>((acc, zone) => {
//     acc[zone] = contacts.filter(c => c.zone === zone)
//     return acc
//   }, {})

//   const ungrouped = contacts.filter(c => !c.zone || !zones.includes(c.zone))

//   return (
//     <div>
//       {/* Header */}
//       <section className="islamic-bg-dark py-14 px-4 text-center">
//         <span className="section-label text-gold-300">Directory</span>
//         <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-3 mb-3">
//           LGI &amp; MCLO Contacts
//         </h1>
//         <p className="text-green-200 font-body max-w-xl mx-auto text-sm leading-relaxed">
//           Local Government Inspectors (LGI) and Muslim Community Liaison Officers (MCLO) 
//           for all 33 local governments of Oyo State.
//         </p>
//       </section>

//       <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

//         {/* Legend */}
//         <div className="flex flex-wrap gap-3 mb-8">
//           {[
//             { label: 'LGI', desc: 'Local Government Inspector — NYSC official contact' },
//             { label: 'MCLO', desc: 'Muslim Community Liaison Officer — MCAN contact' },
//           ].map(({ label, desc }) => (
//             <div key={label} className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-100">
//               <span className={`text-xs font-bold px-2 py-0.5 rounded ${label === 'LGI' ? 'bg-primary-100 text-primary-700' : 'bg-gold-100 text-gold-700'}`}>
//                 {label}
//               </span>
//               <span className="text-xs text-gray-600 font-body">{desc}</span>
//             </div>
//           ))}
//         </div>

//         {/* Zones */}
//         {Object.entries(grouped).map(([zone, lgaList]) => (
//           lgaList.length > 0 && (
//             <section key={zone} className="mb-10">
//               <div className="flex items-center gap-3 mb-4">
//                 <MapPin size={18} className="text-gold-500" />
//                 <h2 className="font-display text-2xl font-semibold text-primary-800">{zone}</h2>
//                 <span className="badge-primary">{lgaList.length} LGAs</span>
//               </div>

//               <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {lgaList.map((lga) => (
//                   <LGACard key={lga.id} lga={lga} />
//                 ))}
//               </div>
//             </section>
//           )
//         ))}

//         {/* Ungrouped */}
//         {ungrouped.length > 0 && (
//           <section className="mb-10">
//             <h2 className="font-display text-2xl font-semibold text-primary-800 mb-4">Other LGAs</h2>
//             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {ungrouped.map((lga) => (
//                 <LGACard key={lga.id} lga={lga} />
//               ))}
//             </div>
//           </section>
//         )}

//         {contacts.length === 0 && (
//           <div className="text-center py-20">
//             <Phone size={40} className="text-gray-200 mx-auto mb-4" />
//             <p className="text-gray-500 font-body">Contact information is being updated. Check back soon.</p>
//           </div>
//         )}

//         {/* Update note */}
//         <div className="mt-10 bg-primary-50 border border-primary-100 rounded-xl p-5 text-center">
//           <p className="text-sm text-primary-700 font-body">
//             Contact details are updated each service year.
//             To report an incorrect number, please{' '}
//             <a href="/contact" className="underline hover:text-primary-900">contact us</a>.
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// function LGACard({ lga }: { lga: LGIContact }) {
//   const hasData = lga.lgi_name || lga.mclo_name

//   return (
//     <div className={`card p-5 ${!hasData ? 'opacity-70' : ''}`}>
//       <h3 className="font-display text-lg font-semibold text-primary-800 mb-3 flex items-center gap-2">
//         <span className="w-2 h-2 rounded-full bg-gold-400 flex-shrink-0" />
//         {lga.lga}
//       </h3>

//       <div className="space-y-3">
//         {/* LGI */}
//         <div className="rounded-lg bg-primary-50 p-3">
//           <p className="text-xs font-bold text-primary-600 uppercase tracking-wide mb-1.5 font-body">LGI</p>
//           {lga.lgi_name ? (
//             <>
//               <p className="text-sm font-medium text-gray-800 font-body">{lga.lgi_name}</p>
//               {lga.lgi_phone && (
//                 <a
//                   href={`tel:${lga.lgi_phone}`}
//                   className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-800 mt-1 transition-colors font-body"
//                 >
//                   <Phone size={12} /> {lga.lgi_phone}
//                 </a>
//               )}
//             </>
//           ) : (
//             <p className="text-xs text-gray-400 italic font-body">Not yet assigned</p>
//           )}
//         </div>

//         {/* MCLO */}
//         <div className="rounded-lg bg-gold-50 p-3">
//           <p className="text-xs font-bold text-gold-600 uppercase tracking-wide mb-1.5 font-body">MCLO</p>
//           {lga.mclo_name ? (
//             <>
//               <p className="text-sm font-medium text-gray-800 font-body">{lga.mclo_name}</p>
//               {lga.mclo_phone && (
//                 <a
//                   href={`tel:${lga.mclo_phone}`}
//                   className="flex items-center gap-1.5 text-sm text-gold-600 hover:text-gold-800 mt-1 transition-colors font-body"
//                 >
//                   <Phone size={12} /> {lga.mclo_phone}
//                 </a>
//               )}
//             </>
//           ) : (
//             <p className="text-xs text-gray-400 italic font-body">Not yet assigned</p>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }


import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Phone, MapPin, Info } from 'lucide-react'
import type { LGIContact } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'LGI & MCLO Contacts',
  description: 'Local Government Inspectors and Muslim Community Liaison Officers for all local governments in Oyo State.',
}

async function getLGIContacts() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('lgi_contacts')
    .select('*')
    .order('sort_order')
  return (data || []) as LGIContact[]
}

const zones = ['Ibadan Metro', 'Oyo Zone', 'Ogbomosho Zone', 'Saki Zone', 'Ibarapa Zone']

export default async function LGIPage() {
  const contacts = await getLGIContacts()

  const grouped = zones.reduce<Record<string, LGIContact[]>>((acc, zone) => {
    acc[zone] = contacts.filter(c => c.zone === zone)
    return acc
  }, {})

  const ungrouped = contacts.filter(c => !c.zone || !zones.includes(c.zone))

  return (
    <div>
      {/* Header */}
      <section className="islamic-bg-dark py-14 px-4 text-center">
        <span className="section-label text-gold-300">Directory</span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-3 mb-3">
          LGI &amp; MCLO Contacts
        </h1>
        <p className="text-green-200 font-body max-w-xl mx-auto text-sm leading-relaxed">
          Local Government Inspectors (LGI) and Muslim Community Liaison Officers (MCLO)
          across all local governments of Oyo State.
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-6">
          {[
            { label: 'LGI',  desc: 'Local Government Inspector — NYSC official contact',    bg: 'bg-primary-100 text-primary-700' },
            { label: 'MCLO', desc: 'Muslim Community Liaison Officer — MCAN contact',        bg: 'bg-gold-100 text-gold-700' },
          ].map(({ label, desc, bg }) => (
            <div key={label} className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-100">
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${bg}`}>{label}</span>
              <span className="text-xs text-gray-600 font-body">{desc}</span>
            </div>
          ))}
        </div>

        {/* Ibadan North split notice */}
        <div className="flex gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <Info size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 font-body">
            <strong>Note on Ibadan North:</strong> Due to the large population of corps members,
            Ibadan North has been divided into two zones —{' '}
            <strong>Ibadan North 1</strong> and <strong>Ibadan North 2</strong> —
            each with its own LGI and MCLO.
          </div>
        </div>

        {/* Zones */}
        {Object.entries(grouped).map(([zone, lgaList]) =>
          lgaList.length > 0 ? (
            <section key={zone} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={18} className="text-gold-500" />
                <h2 className="font-display text-2xl font-semibold text-primary-800">{zone}</h2>
                <span className="badge-primary">{lgaList.length} LGA{lgaList.length > 1 ? 's' : ''}</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {lgaList.map(lga => <LGACard key={lga.id} lga={lga} />)}
              </div>
            </section>
          ) : null
        )}

        {/* Ungrouped */}
        {ungrouped.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display text-2xl font-semibold text-primary-800 mb-4">Other LGAs</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ungrouped.map(lga => <LGACard key={lga.id} lga={lga} />)}
            </div>
          </section>
        )}

        {contacts.length === 0 && (
          <div className="text-center py-20">
            <Phone size={40} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-body">Contact information is being updated. Check back soon.</p>
          </div>
        )}

        {/* Total count */}
        <div className="mt-4 p-4 bg-primary-50 border border-primary-100 rounded-xl flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-primary-700 font-body">
            Showing <strong>{contacts.length}</strong> local government areas across Oyo State.
          </p>
          <p className="text-sm text-primary-700 font-body">
            To report an incorrect number,{' '}
            <a href="/contact" className="underline hover:text-primary-900">contact us</a>.
          </p>
        </div>
      </div>
    </div>
  )
}

function LGACard({ lga }: { lga: LGIContact }) {
  const hasData   = lga.lgi_name || lga.mclo_name
  const isSplit   = lga.lga.includes('1') || lga.lga.includes('2')

  return (
    <div className={`card p-5 ${!hasData ? 'opacity-70' : ''}`}>
      <h3 className="font-display text-lg font-semibold text-primary-800 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-gold-400 flex-shrink-0" />
        {lga.lga}
        {isSplit && (
          <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-body font-medium">
            Split zone
          </span>
        )}
      </h3>

      <div className="space-y-3">
        {/* LGI */}
        <div className="rounded-lg bg-primary-50 p-3">
          <p className="text-xs font-bold text-primary-600 uppercase tracking-wide mb-1.5 font-body">LGI</p>
          {lga.lgi_name ? (
            <>
              <p className="text-sm font-medium text-gray-800 font-body">{lga.lgi_name}</p>
              {lga.lgi_phone && (
                <a
                  href={`tel:${lga.lgi_phone}`}
                  className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-800 mt-1 transition-colors font-body"
                >
                  <Phone size={12} /> {lga.lgi_phone}
                </a>
              )}
            </>
          ) : (
            <p className="text-xs text-gray-400 italic font-body">Not yet assigned</p>
          )}
        </div>

        {/* MCLO */}
        <div className="rounded-lg bg-gold-50 p-3">
          <p className="text-xs font-bold text-gold-600 uppercase tracking-wide mb-1.5 font-body">MCLO</p>
          {lga.mclo_name ? (
            <>
              <p className="text-sm font-medium text-gray-800 font-body">{lga.mclo_name}</p>
              {lga.mclo_phone && (
                <a
                  href={`tel:${lga.mclo_phone}`}
                  className="flex items-center gap-1.5 text-sm text-gold-600 hover:text-gold-800 mt-1 transition-colors font-body"
                >
                  <Phone size={12} /> {lga.mclo_phone}
                </a>
              )}
            </>
          ) : (
            <p className="text-xs text-gray-400 italic font-body">Not yet assigned</p>
          )}
        </div>
      </div>
    </div>
  )
}