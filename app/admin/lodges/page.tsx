'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Building2 } from 'lucide-react'
import type { Lodge } from '@/lib/supabase'

const OYO_LGAS = [
  'Afijio','Akinyele','Atiba','Atisbo','Egbeda','Ibadan North','Ibadan North-East',
  'Ibadan North-West','Ibadan South-East','Ibadan South-West','Ibarapa Central',
  'Ibarapa East','Ibarapa North','Ido','Irepo','Iseyin','Itesiwaju','Iwajowa',
  'Kajola','Lagelu','Ogbomosho North','Ogbomosho South','Ogo Oluwa','Olorunsogo',
  'Oluyole','Ona Ara','Orelope','Ori Ire','Oyo East','Oyo West','Saki East',
  'Saki West','Surulere',
]

const EMPTY: Partial<Lodge> = {
  name: '', lga: '', address: '', landmark: '', contact_name: '', contact_phone: '',
  google_maps_url: '', capacity: undefined,
}

export default function AdminLodgesPage() {
  const supabase = createClient()
  const [lodges, setLodges]   = useState<Lodge[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState<Partial<Lodge>>({ ...EMPTY })
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving]   = useState(false)

  async function fetchLodges() {
    setLoading(true)
    const { data } = await supabase.from('lodges').select('*').order('lga')
    setLodges(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchLodges() }, [])

  function openNew() { setForm({ ...EMPTY }); setEditing(null); setModal(true) }
  function openEdit(l: Lodge) { setForm({ ...l }); setEditing(l.id); setModal(true) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.lga) { toast.error('Name and LGA are required'); return }
    setSaving(true)
    try {
      if (editing) {
        const { error } = await supabase.from('lodges').update(form).eq('id', editing)
        if (error) throw error
        toast.success('Lodge updated!')
      } else {
        const { error } = await supabase.from('lodges').insert(form)
        if (error) throw error
        toast.success('Lodge added!')
      }
      setModal(false); fetchLodges()
    } catch (err: any) { toast.error(err.message) }
    finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this lodge?')) return
    await supabase.from('lodges').delete().eq('id', id)
    toast.success('Deleted'); fetchLodges()
  }

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800">Lodges</h1>
          <p className="text-sm text-gray-500 font-body">{lodges.length} lodges registered</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm gap-2"><Plus size={16} /> Add Lodge</button>
      </div>

      {loading ? <p className="text-sm text-gray-400 font-body">Loading...</p>
        : lodges.length === 0 ? (
          <div className="text-center py-20 card p-10">
            <Building2 size={40} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-body">No lodges yet. Add the first lodge!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {lodges.map((lodge) => (
              <div key={lodge.id} className="card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800 font-body">{lodge.name}</h3>
                    <span className="badge-primary text-xs">{lodge.lga}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(lodge)} className="p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(lodge.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </div>
                {lodge.address && <p className="text-xs text-gray-500 font-body">{lodge.address}</p>}
                {lodge.contact_name && <p className="text-xs text-gray-400 font-body mt-1">Contact: {lodge.contact_name} {lodge.contact_phone}</p>}
              </div>
            ))}
          </div>
        )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg my-8 shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-display text-lg font-semibold">{editing ? 'Edit Lodge' : 'Add Lodge'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="form-label">Lodge Name *</label>
                <input className="form-input" value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Ibadan North MCAN Lodge" required />
              </div>
              <div>
                <label className="form-label">LGA *</label>
                <select className="form-input" value={form.lga || ''} onChange={e => setForm(f => ({ ...f, lga: e.target.value }))} required>
                  <option value="">Select LGA</option>
                  {OYO_LGAS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Address</label>
                <input className="form-input" value={form.address || ''} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Full street address" />
              </div>
              <div>
                <label className="form-label">Landmark</label>
                <input className="form-input" value={form.landmark || ''} onChange={e => setForm(f => ({ ...f, landmark: e.target.value }))} placeholder="e.g. Near Dugbe Market" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Contact Name</label>
                  <input className="form-input" value={form.contact_name || ''} onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Contact Phone</label>
                  <input className="form-input" value={form.contact_phone || ''} onChange={e => setForm(f => ({ ...f, contact_phone: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Capacity</label>
                  <input type="number" className="form-input" value={form.capacity || ''} onChange={e => setForm(f => ({ ...f, capacity: +e.target.value || undefined }))} placeholder="e.g. 50" />
                </div>
                <div>
                  <label className="form-label">Google Maps URL</label>
                  <input className="form-input" value={form.google_maps_url || ''} onChange={e => setForm(f => ({ ...f, google_maps_url: e.target.value }))} placeholder="https://maps.google.com/..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Latitude</label>
                  <input type="number" step="any" className="form-input" value={form.lat || ''} onChange={e => setForm(f => ({ ...f, lat: parseFloat(e.target.value) || undefined }))} placeholder="7.3776" />
                </div>
                <div>
                  <label className="form-label">Longitude</label>
                  <input type="number" step="any" className="form-input" value={form.lng || ''} onChange={e => setForm(f => ({ ...f, lng: parseFloat(e.target.value) || undefined }))} placeholder="3.9470" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                  {saving ? 'Saving...' : editing ? 'Update Lodge' : 'Add Lodge'}
                </button>
                <button type="button" onClick={() => setModal(false)} className="btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
