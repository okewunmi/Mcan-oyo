'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, BookOpen, ChevronDown } from 'lucide-react'
import type { DailyContent } from '@/lib/supabase'

const DAYS   = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']
const TYPES  = ['hadith','azkar','tawheed','fiqh','jumuah','prophet_story','quran_story']

const EMPTY: Partial<DailyContent> = {
  day_of_week: 'monday', content_type: 'hadith', title: '',
  arabic_text: '', english_text: '', transliteration: '',
  chain_of_narration: '', reported_by: '', lesson: '',
  benefits: '', source: '', extra_notes: '', is_published: true,
}

export default function AdminDailyContentPage() {
  const supabase = createClient()
  const [items, setItems]     = useState<DailyContent[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState<Partial<DailyContent>>({ ...EMPTY })
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving]   = useState(false)
  const [filterDay, setFilterDay] = useState('all')

  async function fetchItems() {
    setLoading(true)
    const query = supabase.from('daily_content').select('*').order('created_at', { ascending: false })
    if (filterDay !== 'all') query.eq('day_of_week', filterDay)
    const { data } = await query
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [filterDay])

  function openNew() {
    setForm({ ...EMPTY })
    setEditing(null)
    setModal(true)
  }

  function openEdit(item: DailyContent) {
    setForm({ ...item })
    setEditing(item.id)
    setModal(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.day_of_week) { toast.error('Title and day are required'); return }
    setSaving(true)
    try {
      if (editing) {
        const { error } = await supabase.from('daily_content').update(form).eq('id', editing)
        if (error) throw error
        toast.success('Updated!')
      } else {
        const { error } = await supabase.from('daily_content').insert(form)
        if (error) throw error
        toast.success('Content added!')
      }
      setModal(false)
      fetchItems()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this content?')) return
    await supabase.from('daily_content').delete().eq('id', id)
    toast.success('Deleted')
    fetchItems()
  }

  const Field = ({ label, name, multi = false, rows = 3 }: { label: string; name: keyof DailyContent; multi?: boolean; rows?: number }) => (
    <div>
      <label className="form-label">{label}</label>
      {multi ? (
        <textarea rows={rows} className="form-input resize-y" value={(form[name] as string) || ''}
          onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} />
      ) : (
        <input className="form-input" value={(form[name] as string) || ''}
          onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} />
      )}
    </div>
  )

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800">Daily Content</h1>
          <p className="text-sm text-gray-500 font-body">{items.length} posts</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={filterDay} onChange={e => setFilterDay(e.target.value)}
            className="form-input text-sm py-1.5 w-auto">
            <option value="all">All Days</option>
            {DAYS.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
          </select>
          <button onClick={openNew} className="btn-primary text-sm gap-2">
            <Plus size={16} /> Add Content
          </button>
        </div>
      </div>

      {loading ? <p className="text-gray-400 text-sm font-body">Loading...</p>
        : items.length === 0 ? (
          <div className="text-center py-20 card p-10">
            <BookOpen size={40} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-body">No content yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="card p-4 flex items-center gap-4">
                <div className="flex-shrink-0">
                  <span className="badge-primary capitalize">{item.day_of_week.slice(0,3)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 font-body text-sm truncate">{item.title}</p>
                  <p className="text-xs text-gray-400 font-body capitalize">{item.content_type.replace('_', ' ')} • {item.source?.slice(0, 40)}</p>
                </div>
                {!item.is_published && <span className="badge-gold text-xs">Draft</span>}
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(item)}
                    className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="font-display text-lg font-semibold">{editing ? 'Edit Content' : 'Add Daily Content'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Day *</label>
                  <select className="form-input" value={form.day_of_week} onChange={e => setForm(f => ({ ...f, day_of_week: e.target.value }))}>
                    {DAYS.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Content Type *</label>
                  <select className="form-input" value={form.content_type} onChange={e => setForm(f => ({ ...f, content_type: e.target.value }))}>
                    {TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
                  </select>
                </div>
              </div>
              <Field label="Title *" name="title" />
              <Field label="Arabic Text" name="arabic_text" multi rows={3} />
              <Field label="Transliteration" name="transliteration" />
              <Field label="English Translation" name="english_text" multi rows={3} />
              {(form.content_type === 'hadith') && (
                <>
                  <Field label="Reported By (Narrator)" name="reported_by" />
                  <Field label="Chain of Narration (Isnad)" name="chain_of_narration" multi rows={2} />
                  <Field label="Lesson for Corps Members" name="lesson" multi rows={4} />
                </>
              )}
              {form.content_type === 'azkar' && <Field label="Benefits" name="benefits" multi rows={3} />}
              {(form.content_type === 'tawheed' || form.content_type === 'fiqh') && (
                <>
                  <Field label="Lesson / Explanation" name="lesson" multi rows={4} />
                  <Field label="Extra Notes / Q&A" name="extra_notes" multi rows={4} />
                </>
              )}
              {(form.content_type === 'prophet_story' || form.content_type === 'quran_story') && (
                <Field label="Story & Lesson" name="lesson" multi rows={5} />
              )}
              <Field label="Source (Book, Scholar, Hadith #)" name="source" />
              <label className="flex items-center gap-2 text-sm font-body cursor-pointer">
                <input type="checkbox" checked={form.is_published ?? true}
                  onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))} className="rounded" />
                Published
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                  {saving ? 'Saving...' : editing ? 'Update' : 'Add Content'}
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
