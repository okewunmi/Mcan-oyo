'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Calendar, Image, Radio, Eye, EyeOff, Upload } from 'lucide-react'
import { format } from 'date-fns'
import type { Event } from '@/lib/supabase'
import ImageUploader from '@/components/ImageUploader'
import { notifySubscribers } from '@/lib/notify'

const EMPTY: Partial<Event> & { image_file?: File | null } = {
  title: '', description: '', event_date: '', end_date: '',
  location: '', image_url: '', is_live: false, live_link: '',
  is_published: true, tags: [],
}

export default function AdminEventsPage() {
  const supabase = createClient()
  const [events, setEvents]     = useState<Event[]>([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [form, setForm]         = useState<typeof EMPTY>({ ...EMPTY })
  const [editing, setEditing]   = useState<string | null>(null)
  const [saving, setSaving]     = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [tagInput, setTagInput] = useState('')

  async function fetchEvents() {
    setLoading(true)
    const { data } = await supabase.from('events').select('*').order('event_date', { ascending: false })
    setEvents(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchEvents() }, [])

  function openNew() {
    setForm({ ...EMPTY })
    setEditing(null)
    setImageFile(null)
    setTagInput('')
    setModal(true)
  }

  function openEdit(event: Event) {
    setForm({ ...event })
    setEditing(event.id)
    setImageFile(null)
    setTagInput(event.tags?.join(', ') || '')
    setModal(true)
  }

  async function uploadImage(file: File): Promise<string | null> {
    const ext  = file.name.split('.').pop()
    const path = `events/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('events').upload(path, file, { upsert: true })
    if (error) { toast.error('Image upload failed'); return null }
    const { data } = supabase.storage.from('events').getPublicUrl(path)
    return data.publicUrl
  }

  // async function handleSave(e: React.FormEvent) {
  //   e.preventDefault()
  //   if (!form.title || !form.event_date) { toast.error('Title and date are required'); return }
  //   setSaving(true)
  //   try {
  //     let image_url = form.image_url
  //     if (imageFile) {
  //       const url = await uploadImage(imageFile)
  //       if (url) image_url = url
  //     }

  //     const tags = tagInput ? tagInput.split(',').map(t => t.trim()).filter(Boolean) : []
  //     const payload = { ...form, image_url, tags, slug: undefined }
  //     delete payload.slug

  //     if (editing) {
  //       const { error } = await supabase.from('events').update(payload).eq('id', editing)
  //       if (error) throw error
  //       toast.success('Event updated!')
  //     } else {
  //       const { error } = await supabase.from('events').insert(payload)
  //       if (error) throw error
  //       toast.success('Event created!')
        
  //     }
      
  //     setModal(false)
  //     fetchEvents()
  //   } catch (err: any) {
  //     toast.error(err.message)
  //   } finally {
  //     setSaving(false)
  //   }
  // }
async function handleSave(e: React.FormEvent) {
  e.preventDefault()
  if (!form.title || !form.event_date) { toast.error('Title and date are required'); return }
  setSaving(true)
  try {
    let image_url = form.image_url
    if (imageFile) {
      const url = await uploadImage(imageFile)
      if (url) image_url = url
    }

    const tags = tagInput ? tagInput.split(',').map(t => t.trim()).filter(Boolean) : []
    const payload = { ...form, image_url, tags, slug: undefined }
    delete payload.slug

    if (editing) {
      const { error } = await supabase.from('events').update(payload).eq('id', editing)
      if (error) throw error
      toast.success('Event updated!')
    } else {
      const { data, error } = await supabase
        .from('events')
        .insert(payload)
        .select('slug')   // get slug back so we can build the URL
      if (error) throw error
      toast.success('Event created!')

      // Send push notification to all subscribers
      await notifySubscribers(
        '📅 New Event — MCAN Oyo State',
        form.title!,
        `/events/${data?.[0]?.slug || ''}`,
        image_url || undefined
      )
    }

    setModal(false)
    fetchEvents()
  } catch (err: any) {
    toast.error(err.message)
  } finally {
    setSaving(false)
  }
}

  async function handleDelete(id: string) {
    if (!confirm('Delete this event?')) return
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) { toast.error(error.message); return }
    toast.success('Deleted')
    fetchEvents()
  }

  async function togglePublish(event: Event) {
    await supabase.from('events').update({ is_published: !event.is_published }).eq('id', event.id)
    fetchEvents()
  }

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800">Events</h1>
          <p className="text-sm text-gray-500 font-body">{events.length} total</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm gap-2">
          <Plus size={16} /> New Event
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400 font-body text-sm">Loading...</p>
      ) : events.length === 0 ? (
        <div className="text-center py-20 card p-10">
          <Calendar size={40} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-body">No events yet. Create your first event!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="card p-4 flex items-center gap-4">
              {event.image_url ? (
                <img src={event.image_url} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" alt="" />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Image size={20} className="text-gray-300" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-800 font-body text-sm truncate">{event.title}</h3>
                  {event.is_live && <span className="live-badge text-xs">LIVE</span>}
                  {!event.is_published && <span className="badge-gold">Draft</span>}
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400 font-body flex-wrap">
                  <span className="flex items-center gap-1"><Calendar size={11} /> {format(new Date(event.event_date), 'MMM d, yyyy • h:mm a')}</span>
                  {event.location && <span>{event.location}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => togglePublish(event)} title={event.is_published ? 'Unpublish' : 'Publish'}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                  {event.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => openEdit(event)}
                  className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(event.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl my-8 shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-display text-lg font-semibold">{editing ? 'Edit Event' : 'New Event'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="form-label">Title *</label>
                <input className="form-input" value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Event Date *</label>
                  <input type="datetime-local" className="form-input" value={form.event_date?.slice(0, 16) || ''}
                    onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))} required />
                </div>
                <div>
                  <label className="form-label">End Date</label>
                  <input type="datetime-local" className="form-input" value={form.end_date?.slice(0, 16) || ''}
                    onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="form-label">Location</label>
                <input className="form-input" value={form.location || ''} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. MCAN Lodge, Ibadan North" />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea rows={4} className="form-input resize-none" value={form.description || ''}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              
              <div>
                <label className="form-label">Event Image</label>
                <ImageUploader
                  value={form.image_url || ''}
                  onChange={url => setForm(f => ({ ...f, image_url: url }))}
                  folder="events"
                />
              </div>
              <div>
                <label className="form-label">Tags (comma-separated)</label>
                <input className="form-input" value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="e.g. Seminar, Da'wah, Jumu'ah" />
              </div>
              <div className="flex gap-4 flex-wrap">
                <label className="flex items-center gap-2 text-sm font-body cursor-pointer">
                  <input type="checkbox" checked={form.is_live || false}
                    onChange={e => setForm(f => ({ ...f, is_live: e.target.checked }))} className="rounded" />
                  <Radio size={14} className="text-red-500" /> Mark as Live
                </label>
                <label className="flex items-center gap-2 text-sm font-body cursor-pointer">
                  <input type="checkbox" checked={form.is_published ?? true}
                    onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))} className="rounded" />
                  Published
                </label>
              </div>
              {form.is_live && (
                <div>
                  <label className="form-label">Live Stream URL</label>
                  <input className="form-input" value={form.live_link || ''} onChange={e => setForm(f => ({ ...f, live_link: e.target.value }))} placeholder="https://youtube.com/live/..." />
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                  {saving ? 'Saving...' : editing ? 'Update Event' : 'Create Event'}
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
