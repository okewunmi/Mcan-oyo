'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Users, GripVertical } from 'lucide-react'
import type { Executive } from '@/lib/supabase'

const EMPTY: Partial<Executive> = {
  name: '', position: '', batch: '', phone: '', email: '', photo_url: '', sort_order: 0,
}

export default function AdminExecutivesPage() {
  const supabase = createClient()
  const [items, setItems]   = useState<Executive[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]   = useState(false)
  const [form, setForm]     = useState<Partial<Executive>>({ ...EMPTY })
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  async function fetchItems() {
    setLoading(true)
    const { data } = await supabase.from('executives').select('*').order('sort_order')
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  function openNew() { setForm({ ...EMPTY, sort_order: items.length }); setEditing(null); setPhotoFile(null); setModal(true) }
  function openEdit(item: Executive) { setForm({ ...item }); setEditing(item.id); setPhotoFile(null); setModal(true) }

  async function uploadPhoto(file: File): Promise<string | null> {
    const ext  = file.name.split('.').pop()
    const path = `executives/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('executives').upload(path, file, { upsert: true })
    if (error) { toast.error('Photo upload failed'); return null }
    const { data } = supabase.storage.from('executives').getPublicUrl(path)
    return data.publicUrl
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.position) { toast.error('Name and position are required'); return }
    setSaving(true)
    try {
      let photo_url = form.photo_url
      if (photoFile) {
        const url = await uploadPhoto(photoFile)
        if (url) photo_url = url
      }
      const payload = { ...form, photo_url }
      if (editing) {
        const { error } = await supabase.from('executives').update(payload).eq('id', editing)
        if (error) throw error
        toast.success('Updated!')
      } else {
        const { error } = await supabase.from('executives').insert(payload)
        if (error) throw error
        toast.success('Executive added!')
      }
      setModal(false); fetchItems()
    } catch (err: any) { toast.error(err.message) }
    finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this executive?')) return
    await supabase.from('executives').delete().eq('id', id)
    toast.success('Removed'); fetchItems()
  }

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800">Executives</h1>
          <p className="text-sm text-gray-500 font-body">{items.length} members</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm gap-2"><Plus size={16} /> Add Executive</button>
      </div>

      {loading ? <p className="text-sm text-gray-400 font-body">Loading...</p> : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((exec) => (
            <div key={exec.id} className="card p-4 flex gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-primary-50 flex-shrink-0 border-2 border-primary-100">
                {exec.photo_url ? <img src={exec.photo_url} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center font-display text-primary-400 font-bold">{exec.name.charAt(0)}</div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 font-body text-sm truncate">{exec.name}</p>
                <p className="text-xs text-gold-600 font-body">{exec.position}</p>
                {exec.batch && <p className="text-xs text-gray-400 font-body">Batch {exec.batch}</p>}
                {exec.phone && <p className="text-xs text-gray-500 font-body">{exec.phone}</p>}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => openEdit(exec)} className="p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(exec.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-display text-lg font-semibold">{editing ? 'Edit Executive' : 'Add Executive'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-3">
              {[
                { label: 'Full Name *', key: 'name' },
                { label: 'Position *', key: 'position', placeholder: 'e.g. Ameer, Naibu Ameer' },
                { label: 'Batch',      key: 'batch',    placeholder: 'e.g. 2024A' },
                { label: 'Phone',      key: 'phone' },
                { label: 'Email',      key: 'email' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="form-label">{label}</label>
                  <input className="form-input" value={(form as any)[key] || ''} placeholder={placeholder}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label className="form-label">Photo</label>
                <input type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files?.[0] || null)} className="form-input text-sm" />
              </div>
              <div>
                <label className="form-label">Sort Order (0 = first)</label>
                <input type="number" className="form-input" value={form.sort_order ?? 0}
                  onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                  {saving ? 'Saving...' : editing ? 'Update' : 'Add Executive'}
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
