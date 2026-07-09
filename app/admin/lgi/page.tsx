// 'use client'

// import { useEffect, useState } from 'react'
// import { createClient } from '@/lib/supabase'
// import toast from 'react-hot-toast'
// import { Pencil, X, MapPin, Save } from 'lucide-react'
// import type { LGIContact } from '@/lib/supabase'

// export default function AdminLGIPage() {
//   const supabase = createClient()
//   const [items, setItems]     = useState<LGIContact[]>([])
//   const [loading, setLoading] = useState(true)
//   const [editing, setEditing] = useState<string | null>(null)
//   const [saving, setSaving]   = useState(false)
//   const [editData, setEditData] = useState<Partial<LGIContact>>({})

//   async function fetchItems() {
//     setLoading(true)
//     const { data } = await supabase.from('lgi_contacts').select('*').order('sort_order')
//     setItems(data || [])
//     setLoading(false)
//   }

//   useEffect(() => { fetchItems() }, [])

//   function startEdit(item: LGIContact) {
//     setEditing(item.id)
//     setEditData({ lgi_name: item.lgi_name || '', lgi_phone: item.lgi_phone || '', mclo_name: item.mclo_name || '', mclo_phone: item.mclo_phone || '' })
//   }

//   async function saveEdit(id: string) {
//     setSaving(true)
//     const { error } = await supabase.from('lgi_contacts').update(editData).eq('id', id)
//     if (error) toast.error(error.message)
//     else { toast.success('Saved!'); setEditing(null); fetchItems() }
//     setSaving(false)
//   }

//   // const zones = [...new Set(items.map(i => i.zone).filter(Boolean))]
// const zones = Array.from(new Set(items.map(i => i.zone).filter(Boolean))) as string[]
//   return (
//     <div className="p-6 sm:p-8 max-w-5xl mx-auto">
//       <div className="mb-6">
//         <h1 className="font-display text-2xl font-bold text-gray-800">LGI &amp; MCLO Contacts</h1>
//         <p className="text-sm text-gray-500 font-body">Update contact details for all 33 Oyo LGAs</p>
//       </div>

//       {loading ? <p className="text-sm text-gray-400 font-body">Loading...</p> : (
//         <div className="space-y-8">
//           {zones.map(zone => {
//             const zoneItems = items.filter(i => i.zone === zone)
//             return (
//               <div key={zone}>
//                 <h2 className="font-display text-lg font-semibold text-primary-800 mb-3 flex items-center gap-2">
//                   <MapPin size={16} className="text-gold-500" /> {zone}
//                 </h2>
//                 <div className="space-y-2">
//                   {zoneItems.map((item) => (
//                     <div key={item.id} className="card p-4">
//                       <div className="flex items-center justify-between mb-3">
//                         <h3 className="font-semibold text-gray-800 font-body">{item.lga}</h3>
//                         {editing === item.id ? (
//                           <div className="flex gap-2">
//                             <button onClick={() => saveEdit(item.id)} disabled={saving}
//                               className="flex items-center gap-1 text-xs btn-primary py-1.5 px-3">
//                               <Save size={13} /> {saving ? '...' : 'Save'}
//                             </button>
//                             <button onClick={() => setEditing(null)}
//                               className="text-gray-400 hover:text-gray-600 p-1"><X size={16} /></button>
//                           </div>
//                         ) : (
//                           <button onClick={() => startEdit(item)}
//                             className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800 font-body">
//                             <Pencil size={13} /> Edit
//                           </button>
//                         )}
//                       </div>

//                       {editing === item.id ? (
//                         <div className="grid sm:grid-cols-2 gap-3">
//                           {[
//                             { label: 'LGI Name', key: 'lgi_name' },
//                             { label: 'LGI Phone', key: 'lgi_phone' },
//                             { label: 'MCLO Name', key: 'mclo_name' },
//                             { label: 'MCLO Phone', key: 'mclo_phone' },
//                           ].map(({ label, key }) => (
//                             <div key={key}>
//                               <label className="form-label text-xs">{label}</label>
//                               <input className="form-input text-sm py-1.5"
//                                 value={(editData as any)[key] || ''}
//                                 onChange={e => setEditData(d => ({ ...d, [key]: e.target.value }))} />
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         <div className="grid sm:grid-cols-2 gap-3 text-sm">
//                           <div className="bg-primary-50 rounded-lg p-2.5">
//                             <p className="text-xs text-primary-500 font-semibold mb-0.5 font-body">LGI</p>
//                             <p className="text-gray-700 font-body">{item.lgi_name || <span className="italic text-gray-300">Not set</span>}</p>
//                             <p className="text-gray-500 font-body text-xs">{item.lgi_phone}</p>
//                           </div>
//                           <div className="bg-gold-50 rounded-lg p-2.5">
//                             <p className="text-xs text-gold-500 font-semibold mb-0.5 font-body">MCLO</p>
//                             <p className="text-gray-700 font-body">{item.mclo_name || <span className="italic text-gray-300">Not set</span>}</p>
//                             <p className="text-gray-500 font-body text-xs">{item.mclo_phone}</p>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//       )}
//     </div>
//   )
// }


'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Pencil, X, MapPin, Save, Info } from 'lucide-react'
import type { LGIContact } from '@/lib/supabase'

export default function AdminLGIPage() {
  const supabase = createClient()
  const [items, setItems]     = useState<LGIContact[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving]   = useState(false)
  const [editData, setEditData] = useState<Partial<LGIContact>>({})

  async function fetchItems() {
    setLoading(true)
    const { data } = await supabase.from('lgi_contacts').select('*').order('sort_order')
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  function startEdit(item: LGIContact) {
    setEditing(item.id)
    setEditData({
      lgi_name:   item.lgi_name  || '',
      lgi_phone:  item.lgi_phone || '',
      mclo_name:  item.mclo_name || '',
      mclo_phone: item.mclo_phone || '',
    })
  }

  async function saveEdit(id: string) {
    setSaving(true)
    const { error } = await supabase.from('lgi_contacts').update(editData).eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Saved!'); setEditing(null); fetchItems() }
    setSaving(false)
  }

  const zones = [...new Set(items.map(i => i.zone).filter(Boolean))]

  const totalFilled = items.filter(i => i.lgi_name || i.mclo_name).length

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-800">LGI &amp; MCLO Contacts</h1>
        <p className="text-sm text-gray-500 font-body">
          {items.length} local government areas — {totalFilled} with contact details
        </p>
      </div>

      {/* Ibadan North note */}
      <div className="flex gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800 font-body">
          <strong>Ibadan North</strong> is split into <strong>Ibadan North 1</strong> and{' '}
          <strong>Ibadan North 2</strong> due to the large corps member population.
          Each has a separate LGI and MCLO.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 font-body">Loading...</p>
      ) : (
        <div className="space-y-8">
          {zones.map(zone => {
            const zoneItems = items.filter(i => i.zone === zone)
            return (
              <div key={zone}>
                <h2 className="font-display text-lg font-semibold text-primary-800 mb-3 flex items-center gap-2">
                  <MapPin size={16} className="text-gold-500" />
                  {zone}
                  <span className="badge-primary text-xs">{zoneItems.length}</span>
                </h2>
                <div className="space-y-2">
                  {zoneItems.map(item => (
                    <div key={item.id} className="card p-4">
                      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                        <h3 className="font-semibold text-gray-800 font-body flex items-center gap-2">
                          {item.lga}
                          {(item.lga.includes('1') || item.lga.includes('2')) && (
                            <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-body">
                              Split zone
                            </span>
                          )}
                        </h3>
                        {editing === item.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveEdit(item.id)}
                              disabled={saving}
                              className="flex items-center gap-1 text-xs btn-primary py-1.5 px-3"
                            >
                              <Save size={13} /> {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={() => setEditing(null)}
                              className="text-gray-400 hover:text-gray-600 p-1"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(item)}
                            className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800 font-body border border-primary-200 px-2.5 py-1 rounded-lg hover:bg-primary-50 transition-colors"
                          >
                            <Pencil size={13} /> Edit
                          </button>
                        )}
                      </div>

                      {editing === item.id ? (
                        <div className="grid sm:grid-cols-2 gap-3">
                          {[
                            { label: 'LGI Name',   key: 'lgi_name' },
                            { label: 'LGI Phone',  key: 'lgi_phone' },
                            { label: 'MCLO Name',  key: 'mclo_name' },
                            { label: 'MCLO Phone', key: 'mclo_phone' },
                          ].map(({ label, key }) => (
                            <div key={key}>
                              <label className="form-label text-xs">{label}</label>
                              <input
                                className="form-input text-sm py-1.5"
                                value={(editData as any)[key] || ''}
                                onChange={e => setEditData(d => ({ ...d, [key]: e.target.value }))}
                                placeholder={key.includes('phone') ? '+2348012345678' : 'Full name'}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid sm:grid-cols-2 gap-3 text-sm">
                          <div className="bg-primary-50 rounded-lg p-2.5">
                            <p className="text-xs text-primary-500 font-semibold mb-0.5 font-body">LGI</p>
                            <p className="text-gray-700 font-body font-medium">
                              {item.lgi_name || <span className="italic text-gray-300 font-normal">Not set</span>}
                            </p>
                            {item.lgi_phone && (
                              <a href={`tel:${item.lgi_phone}`} className="text-xs text-primary-600 font-body">
                                {item.lgi_phone}
                              </a>
                            )}
                          </div>
                          <div className="bg-gold-50 rounded-lg p-2.5">
                            <p className="text-xs text-gold-500 font-semibold mb-0.5 font-body">MCLO</p>
                            <p className="text-gray-700 font-body font-medium">
                              {item.mclo_name || <span className="italic text-gray-300 font-normal">Not set</span>}
                            </p>
                            {item.mclo_phone && (
                              <a href={`tel:${item.mclo_phone}`} className="text-xs text-gold-600 font-body">
                                {item.mclo_phone}
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
