'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Save, Settings, Phone, Mail, Globe, Building } from 'lucide-react'

const SETTINGS_KEYS = [
  { key: 'ameer_name',       label: "Ameer's Name",         icon: '👤', group: 'contact' },
  { key: 'ameer_phone',      label: "Ameer's Phone Number", icon: '📞', group: 'contact' },
  { key: 'email',            label: 'Official Email',        icon: '📧', group: 'contact' },
  { key: 'whatsapp',         label: 'WhatsApp Number',       icon: '💬', group: 'contact' },
  { key: 'address',          label: 'Office Address',        icon: '📍', group: 'contact' },
  { key: 'instagram',        label: 'Instagram Handle',      icon: '📸', group: 'social' },
  { key: 'facebook',         label: 'Facebook Page',         icon: '👍', group: 'social' },
  { key: 'twitter',          label: 'Twitter / X Handle',    icon: '🐦', group: 'social' },
  { key: 'bank_name',        label: 'Bank Name',             icon: '🏦', group: 'donation' },
  { key: 'account_name',     label: 'Account Name',          icon: '💳', group: 'donation' },
  { key: 'account_number',   label: 'Account Number',        icon: '🔢', group: 'donation' },
  { key: 'donation_note',    label: 'Donation Description',  icon: '📝', group: 'donation' },
]

const GROUPS = [
  { key: 'contact',  label: 'Contact Information', icon: Phone },
  { key: 'social',   label: 'Social Media',         icon: Globe },
  { key: 'donation', label: 'Donation Details',     icon: Building },
]

export default function AdminSettingsPage() {
  const supabase = createClient()
  const [values, setValues]   = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('site_settings').select('key,value')
      const map: Record<string, string> = {}
      data?.forEach(({ key, value }) => { map[key] = value || '' })
      setValues(map)
      setLoading(false)
    }
    fetch()
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      const updates = Object.entries(values).map(([key, value]) =>
        supabase.from('site_settings').upsert({ key, value }, { onConflict: 'key' })
      )
      await Promise.all(updates)
      toast.success('Settings saved!')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-sm text-gray-400 font-body">Loading settings...</div>

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800">Site Settings</h1>
          <p className="text-sm text-gray-500 font-body">Manage contact info, social media, and donation details</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary gap-2">
          <Save size={16} /> {saving ? 'Saving...' : 'Save All'}
        </button>
      </div>

      {GROUPS.map(({ key: groupKey, label, icon: Icon }) => {
        const groupSettings = SETTINGS_KEYS.filter(s => s.group === groupKey)
        return (
          <div key={groupKey} className="card p-6 space-y-4">
            <h2 className="font-display text-lg font-semibold text-primary-800 flex items-center gap-2 pb-2 border-b border-gray-100">
              <Icon size={18} className="text-gold-500" /> {label}
            </h2>
            {groupSettings.map(({ key, label, icon }) => (
              <div key={key}>
                <label className="form-label flex items-center gap-1.5">
                  <span>{icon}</span> {label}
                </label>
                {key === 'donation_note' ? (
                  <textarea
                    rows={3}
                    className="form-input resize-none"
                    value={values[key] || ''}
                    onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                  />
                ) : (
                  <input
                    className="form-input"
                    value={values[key] || ''}
                    onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                    placeholder={key === 'instagram' ? '@mcan_oyo' : key === 'ameer_phone' ? '+2348012345678' : ''}
                  />
                )}
              </div>
            ))}
          </div>
        )
      })}

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="btn-primary gap-2">
          <Save size={16} /> {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  )
}
