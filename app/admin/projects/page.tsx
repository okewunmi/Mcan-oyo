'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import ImageUploader from '@/components/ImageUploader'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Hammer } from 'lucide-react'
import type { Project } from '@/components/ProjectCard'
import { notifySubscribers } from '@/lib/notify'

const EMPTY: Partial<Project> = {
  title: '', description: '', status: 'upcoming',
  image_url: '', location: '', start_date: '', end_date: '', is_published: true,
}

export default function AdminProjectsPage() {
  const supabase = createClient()
  const [items, setItems]     = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState<Partial<Project>>({ ...EMPTY })
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving]   = useState(false)

  async function fetchItems() {
    setLoading(true)
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  function openNew() { setForm({ ...EMPTY }); setEditing(null); setModal(true) }
  function openEdit(p: Project) { setForm({ ...p }); setEditing(p.id); setModal(true) }

  // async function handleSave(e: React.FormEvent) {
  //   e.preventDefault()
  //   if (!form.title) { toast.error('Title is required'); return }
  //   setSaving(true)
  //   try {
  //     // Auto-generate slug from title
  //     const slug = form.title.toLowerCase()
  //       .replace(/[^a-z0-9\s]/g, '')
  //       .replace(/\s+/g, '-') + '-' + Date.now()

  //     const payload = editing ? form : { ...form, slug }

  //     if (editing) {
  //       const { error } = await supabase.from('projects').update(payload).eq('id', editing)
  //       if (error) throw error
  //       toast.success('Project updated!')
  //     } else {
  //       const { error } = await supabase.from('projects').insert(payload)
  //       if (error) throw error
  //       toast.success('Project created!')
  //     }
  //     setModal(false); fetchItems()
  //   } catch (err: any) { toast.error(err.message) }
  //   finally { setSaving(false) }
  // }

async function handleSave(e: React.FormEvent) {
  e.preventDefault()
  if (!form.title) { toast.error('Title is required'); return }
  setSaving(true)
  try {
    const slug = form.title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-') + '-' + Date.now()

    const payload = editing ? form : { ...form, slug }

    if (editing) {
      const { error } = await supabase.from('projects').update(payload).eq('id', editing)
      if (error) throw error
      toast.success('Project updated!')
    } else {
      const { error } = await supabase.from('projects').insert(payload)
      if (error) throw error
      toast.success('Project created!')

      await notifySubscribers(
        '🏗️ New Project — MCAN Oyo State',
        form.title!,
        `/projects/${slug}`,
        form.image_url || undefined
      )
    }
    setModal(false); fetchItems()
  } catch (err: any) { toast.error(err.message) }
  finally { setSaving(false) }
}

  async function handleDelete(id: string) {
    if (!confirm('Delete this project?')) return
    await supabase.from('projects').delete().eq('id', id)
    toast.success('Deleted'); fetchItems()
  }

  const STATUS_COLORS: Record<string, string> = {
    ongoing:   'bg-blue-100 text-blue-700',
    upcoming:  'bg-amber-100 text-amber-700',
    completed: 'bg-emerald-100 text-emerald-700',
  }

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800">Projects</h1>
          <p className="text-sm text-gray-500 font-body">{items.length} projects</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm gap-2"><Plus size={16} /> New Project</button>
      </div>

      {loading ? <p className="text-sm text-gray-400 font-body">Loading...</p>
        : items.length === 0 ? (
          <div className="text-center py-20 card p-10">
            <Hammer size={40} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-body">No projects yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(p => (
              <div key={p.id} className="card p-4 flex items-center gap-4">
                {p.image_url
                  ? <img src={p.image_url} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" alt="" />
                  : <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0"><Hammer size={20} className="text-gray-300" /></div>
                }
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-800 font-body text-sm truncate">{p.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold font-body capitalize ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                    {!p.is_published && <span className="badge-gold text-xs">Draft</span>}
                  </div>
                  {p.location && <p className="text-xs text-gray-400 font-body mt-0.5">{p.location}</p>}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600"><Pencil size={15} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl my-8 shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white rounded-t-2xl">
              <h2 className="font-display text-lg font-semibold">{editing ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="form-label">Title *</label>
                <input className="form-input" value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div>
                <label className="form-label">Status *</label>
                <select className="form-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea rows={4} className="form-input resize-none" value={form.description || ''}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Image</label>
                <ImageUploader
                  value={form.image_url || ''}
                  onChange={url => setForm(f => ({ ...f, image_url: url }))}
                  folder="projects"
                />
              </div>
              <div>
                <label className="form-label">Location</label>
                <input className="form-input" value={form.location || ''} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Ibadan North LGA" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Start Date</label>
                  <input type="date" className="form-input" value={form.start_date || ''} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">End Date</label>
                  <input type="date" className="form-input" value={form.end_date || ''} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm font-body cursor-pointer">
                <input type="checkbox" checked={form.is_published ?? true} onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))} className="rounded" />
                Published
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                  {saving ? 'Saving...' : editing ? 'Update Project' : 'Create Project'}
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