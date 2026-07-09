'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import ImageUploader from '@/components/ImageUploader'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Newspaper, Eye, EyeOff } from 'lucide-react'
import { format } from 'date-fns'
import { notifySubscribers } from '@/lib/notify'

const CATEGORIES = ['general', "da'wah", 'community', 'announcement', 'achievement']

const EMPTY = {
  title: '', excerpt: '', content: '', image_url: '',
  author: 'MCAN Oyo State', category: 'general',
  is_published: true, published_at: new Date().toISOString().slice(0, 16),
}

export default function AdminNewsPage() {
  const supabase = createClient()
  const [items, setItems]     = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState<any>({ ...EMPTY })
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving]   = useState(false)

  async function fetchItems() {
    setLoading(true)
    const { data } = await supabase.from('news').select('*').order('published_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  function openNew() { setForm({ ...EMPTY }); setEditing(null); setModal(true) }
  function openEdit(item: any) { setForm({ ...item, published_at: item.published_at?.slice(0, 16) }); setEditing(item.id); setModal(true) }

  // async function handleSave(e: React.FormEvent) {
  //   e.preventDefault()
  //   if (!form.title) { toast.error('Title is required'); return }
  //   setSaving(true)
  //   try {
  //     const payload = { ...form, slug: undefined }
  //     delete payload.slug

  //     if (editing) {
  //       const { error } = await supabase.from('news').update(payload).eq('id', editing)
  //       if (error) throw error
  //       toast.success('Updated!')
  //     } else {
  //       const { error } = await supabase.from('news').insert(payload)
  //       if (error) throw error
  //       toast.success('Article published!')
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
    const payload = { ...form, slug: undefined }
    delete payload.slug

    if (editing) {
      const { error } = await supabase.from('news').update(payload).eq('id', editing)
      if (error) throw error
      toast.success('Updated!')
    } else {
      const { data, error } = await supabase
        .from('news')
        .insert(payload)
        .select('slug')
      if (error) throw error
      toast.success('Article published!')

      await notifySubscribers(
        '📰 MCAN Oyo — News Update',
        form.title,
        `/news/${data?.[0]?.slug || ''}`,
        form.image_url || undefined
      )
    }
    setModal(false); fetchItems()
  } catch (err: any) { toast.error(err.message) }
  finally { setSaving(false) }
}
  async function handleDelete(id: string) {
    if (!confirm('Delete this article?')) return
    await supabase.from('news').delete().eq('id', id)
    toast.success('Deleted'); fetchItems()
  }

  async function togglePublish(item: any) {
    await supabase.from('news').update({ is_published: !item.is_published }).eq('id', item.id)
    fetchItems()
  }

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800">News</h1>
          <p className="text-sm text-gray-500 font-body">{items.length} articles</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm gap-2"><Plus size={16} /> New Article</button>
      </div>

      {loading ? <p className="text-sm text-gray-400 font-body">Loading...</p>
        : items.length === 0 ? (
          <div className="text-center py-20 card p-10">
            <Newspaper size={40} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-body">No articles yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="card p-4 flex items-center gap-4">
                {item.image_url
                  ? <img src={item.image_url} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" alt="" />
                  : <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0"><Newspaper size={20} className="text-gray-300" /></div>
                }
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-800 font-body text-sm truncate">{item.title}</p>
                    <span className="badge-primary capitalize text-xs">{item.category}</span>
                    {!item.is_published && <span className="badge-gold text-xs">Draft</span>}
                  </div>
                  <p className="text-xs text-gray-400 font-body mt-0.5">
                    {format(new Date(item.published_at), 'MMM d, yyyy')} · {item.author}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => togglePublish(item)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700">
                    {item.is_published ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600"><Pencil size={15} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="font-display text-lg font-semibold">{editing ? 'Edit Article' : 'New Article'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="form-label">Title *</label>
                <input className="form-input" value={form.title} onChange={e => setForm((f: any) => ({ ...f, title: e.target.value }))} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Category</label>
                  <select className="form-input" value={form.category} onChange={e => setForm((f: any) => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Author</label>
                  <input className="form-input" value={form.author} onChange={e => setForm((f: any) => ({ ...f, author: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="form-label">Excerpt (shown in list)</label>
                <textarea rows={2} className="form-input resize-none" value={form.excerpt || ''}
                  onChange={e => setForm((f: any) => ({ ...f, excerpt: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Full Content</label>
                <textarea rows={8} className="form-input resize-y" value={form.content || ''}
                  onChange={e => setForm((f: any) => ({ ...f, content: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Image</label>
                <ImageUploader
                  value={form.image_url || ''}
                  onChange={(url: string) => setForm((f: any) => ({ ...f, image_url: url }))}
                  folder="news"
                />
              </div>
              <div>
                <label className="form-label">Publish Date</label>
                <input type="datetime-local" className="form-input" value={form.published_at || ''}
                  onChange={e => setForm((f: any) => ({ ...f, published_at: e.target.value }))} />
              </div>
              <label className="flex items-center gap-2 text-sm font-body cursor-pointer">
                <input type="checkbox" checked={form.is_published}
                  onChange={e => setForm((f: any) => ({ ...f, is_published: e.target.checked }))} className="rounded" />
                Published
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                  {saving ? 'Saving...' : editing ? 'Update Article' : 'Publish Article'}
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