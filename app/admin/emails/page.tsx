'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import {
  splitIntoBatches, sendBatch, saveQueuedCampaign,
  getQueuedCampaigns, removeQueuedCampaign,
  type EmailRecipient, type QueuedCampaign,
} from '@/lib/emailjs'
import toast from 'react-hot-toast'
import { Mail, Send, Users, Clock, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react'
import type { Registration } from '@/lib/supabase'

const currentYear = new Date().getFullYear()

export default function AdminEmailsPage() {
  const supabase = createClient()
  const [regs, setRegs]               = useState<Registration[]>([])
  const [loading, setLoading]         = useState(true)
  const [subject, setSubject]         = useState('')
  const [body, setBody]               = useState('')
  const [filterBatch, setFilterBatch] = useState('all')
  const [filterGender, setFilterGender] = useState('all')
  const [sending, setSending]         = useState(false)
  const [progress, setProgress]       = useState<{ sent: number; total: number } | null>(null)
  const [queued, setQueued]           = useState<QueuedCampaign[]>([])

  useEffect(() => {
    fetchRegs()
    setQueued(getQueuedCampaigns())
  }, [])

  async function fetchRegs() {
    setLoading(true)
    const { data } = await supabase
      .from('registrations')
      .select('full_name, email, batch, gender, stream')
      .eq('service_year', currentYear)
    setRegs((data as Registration[]) || [])
    setLoading(false)
  }

  // Compute target recipients from filters
  const targetRegs = regs.filter(r =>
    (filterBatch  === 'all' || r.batch  === filterBatch) &&
    (filterGender === 'all' || r.gender === filterGender)
  )

  const recipients: EmailRecipient[] = targetRegs.map(r => ({
    name: r.full_name,
    email: r.email,
  }))

  const batches = splitIntoBatches(recipients)

  async function handleSend() {
    if (!subject.trim() || !body.trim()) { toast.error('Subject and body are required'); return }
    if (recipients.length === 0) { toast.error('No recipients match your filter'); return }
    if (!confirm(`Send email to ${recipients.length} corps members?\n\n${batches.length > 1 ? `⚠️ ${batches.length} batches (100/day limit). Only batch 1 will send today, the rest will be queued.` : 'This will send now.'}`)) return

    setSending(true)
    setProgress({ sent: 0, total: batches[0].length })

    try {
      // Send only the FIRST batch today (EmailJS 100/day limit)
      const { sent, failed } = await sendBatch(
        batches[0],
        subject,
        body,
        (sent, total) => setProgress({ sent, total })
      )

      toast.success(`Batch 1 sent: ${sent} emails${failed ? `, ${failed} failed` : ''}`)

      // Queue remaining batches for future days
      if (batches.length > 1) {
        const campaign: QueuedCampaign = {
          id: Date.now().toString(),
          subject,
          body,
          batches,
          currentBatch: 1, // next to send
          createdAt: new Date().toISOString(),
        }
        saveQueuedCampaign(campaign)
        setQueued(getQueuedCampaigns())
        toast(`${batches.length - 1} more batch(es) queued. Send tomorrow from the queue below.`, { icon: '⏰' })
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSending(false)
      setProgress(null)
    }
  }

  async function sendNextBatch(campaign: QueuedCampaign) {
    if (campaign.currentBatch >= campaign.batches.length) {
      removeQueuedCampaign(campaign.id)
      setQueued(getQueuedCampaigns())
      toast.success('Campaign complete!')
      return
    }

    setSending(true)
    const batch = campaign.batches[campaign.currentBatch]
    setProgress({ sent: 0, total: batch.length })

    const { sent, failed } = await sendBatch(
      batch, campaign.subject, campaign.body,
      (s, t) => setProgress({ sent: s, total: t })
    )

    toast.success(`Batch ${campaign.currentBatch + 1} sent: ${sent}${failed ? `, ${failed} failed` : ''}`)

    const updatedCampaign = { ...campaign, currentBatch: campaign.currentBatch + 1 }
    if (updatedCampaign.currentBatch >= campaign.batches.length) {
      removeQueuedCampaign(campaign.id)
    } else {
      saveQueuedCampaign(updatedCampaign)
    }
    setQueued(getQueuedCampaigns())
    setSending(false)
    setProgress(null)
  }

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-800">Email Campaigns</h1>
        <p className="text-sm text-gray-500 font-body mt-1">
          Send programme updates to registered corps members. Limited to 100 emails/day via EmailJS.
        </p>
      </div>

      {/* Info box */}
      <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800 font-body">
          <strong>Batching:</strong> EmailJS free tier allows 100 emails/day. If your list exceeds 100, 
          the campaign will be split into batches. Send batch 1 today, then return tomorrow to send batch 2, and so on.
        </div>
      </div>

      {/* Compose */}
      <div className="card p-6 space-y-5">
        <h2 className="font-display text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Mail size={18} className="text-primary-600" /> Compose Message
        </h2>

        {/* Filters */}
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="form-label">Target Batch</label>
            <select className="form-input" value={filterBatch} onChange={e => setFilterBatch(e.target.value)}>
              <option value="all">All Batches</option>
              <option value="A">Batch A</option>
              <option value="B">Batch B</option>
              <option value="C">Batch C</option>
            </select>
          </div>
          <div>
            <label className="form-label">Target Gender</label>
            <select className="form-input" value={filterGender} onChange={e => setFilterGender(e.target.value)}>
              <option value="all">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        {/* Recipient count */}
        <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg">
          <Users size={16} className="text-primary-600" />
          <span className="text-sm font-body text-primary-800">
            <strong>{recipients.length}</strong> recipient{recipients.length !== 1 ? 's' : ''} selected
            {batches.length > 1 && (
              <span className="text-amber-700 ml-2">
                — {batches.length} batches needed (100/day limit)
              </span>
            )}
          </span>
        </div>

        <div>
          <label className="form-label">Subject *</label>
          <input className="form-input" value={subject} onChange={e => setSubject(e.target.value)}
            placeholder="e.g. MCAN Oyo — Upcoming Seminar on Marriage in Islam" />
        </div>

        <div>
          <label className="form-label">Message Body *</label>
          <textarea
            rows={8}
            className="form-input resize-y"
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="As-salamu alaykum wa rahmatullahi wa barakatuh,

Dear Corps Member,

..."
          />
          <p className="text-xs text-gray-400 mt-1 font-body">
            Plain text. Use {`{name}`} to personalise with the recipient's name.
          </p>
        </div>

        {/* Progress */}
        {progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500 font-body">
              <span>Sending... {progress.sent} / {progress.total}</span>
              <span>{Math.round((progress.sent / progress.total) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(progress.sent / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={sending || loading || recipients.length === 0}
          className="btn-primary gap-2 w-full justify-center py-3"
        >
          <Send size={16} />
          {sending ? 'Sending batch 1...' : `Send to ${recipients.length} recipients`}
          {batches.length > 1 && !sending && ` (batch 1 of ${batches.length})`}
        </button>
      </div>

      {/* Queued Campaigns */}
      {queued.length > 0 && (
        <div className="card p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Clock size={18} className="text-amber-500" /> Queued Campaigns
          </h2>
          <p className="text-sm text-gray-500 font-body">
            These campaigns have remaining batches. Send one batch per day.
          </p>
          <div className="space-y-3">
            {queued.map((campaign) => (
              <div key={campaign.id} className="border border-amber-200 bg-amber-50 rounded-xl p-4">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <p className="font-semibold text-gray-800 font-body text-sm">{campaign.subject}</p>
                    <p className="text-xs text-gray-500 font-body mt-0.5">
                      Batch {campaign.currentBatch + 1} of {campaign.batches.length} •{' '}
                      {campaign.batches[campaign.currentBatch]?.length || 0} recipients remaining this batch •{' '}
                      Created {new Date(campaign.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => sendNextBatch(campaign)}
                      disabled={sending}
                      className="btn-primary text-sm py-1.5 px-4 gap-1.5"
                    >
                      <Send size={13} />
                      Send Batch {campaign.currentBatch + 1}
                    </button>
                    <button
                      onClick={() => { removeQueuedCampaign(campaign.id); setQueued(getQueuedCampaigns()) }}
                      className="text-xs text-red-500 hover:text-red-700 font-body px-2"
                    >
                      Discard
                    </button>
                  </div>
                </div>
                {/* Mini progress */}
                <div className="mt-3">
                  <div className="w-full bg-white rounded-full h-1.5">
                    <div
                      className="bg-amber-500 h-1.5 rounded-full"
                      style={{ width: `${(campaign.currentBatch / campaign.batches.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1 font-body">
                    {campaign.currentBatch} of {campaign.batches.length} batches sent
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Registrations Summary */}
      <div className="card p-6">
        <h2 className="font-display text-lg font-semibold text-gray-800 mb-4">Recipients Overview ({currentYear})</h2>
        {loading ? <p className="text-sm text-gray-400 font-body">Loading...</p> : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total',    count: regs.length },
              { label: 'Batch A', count: regs.filter(r => r.batch === 'A').length },
              { label: 'Batch B', count: regs.filter(r => r.batch === 'B').length },
              { label: 'Batch C', count: regs.filter(r => r.batch === 'C').length },
            ].map(({ label, count }) => (
              <div key={label} className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="font-display text-2xl font-bold text-primary-700">{count}</p>
                <p className="text-xs text-gray-500 font-body">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
