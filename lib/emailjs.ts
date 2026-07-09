import emailjs from '@emailjs/browser'

const SERVICE_ID  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!
const PUBLIC_KEY  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!

const BATCH_SIZE = 100 // EmailJS free tier: 100 emails/day

export interface EmailRecipient {
  name: string
  email: string
}

export interface EmailPayload {
  subject: string
  body: string
  recipients: EmailRecipient[]
}

/**
 * Splits recipients into batches of 100.
 * Stores unsent batches in localStorage so they can be sent on subsequent days.
 */
export function splitIntoBatches(recipients: EmailRecipient[]): EmailRecipient[][] {
  const batches: EmailRecipient[][] = []
  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    batches.push(recipients.slice(i, i + BATCH_SIZE))
  }
  return batches
}

/**
 * Send a single email via EmailJS.
 */
export async function sendSingleEmail(
  to_email: string,
  to_name: string,
  subject: string,
  message: string
): Promise<boolean> {
  try {
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      { to_email, to_name, subject, message },
      PUBLIC_KEY
    )
    return result.status === 200
  } catch (err) {
    console.error(`Failed to send email to ${to_email}:`, err)
    return false
  }
}

/**
 * Send to one batch (up to 100 recipients).
 * Returns { sent, failed }.
 */
export async function sendBatch(
  batch: EmailRecipient[],
  subject: string,
  message: string,
  onProgress?: (sent: number, total: number) => void
): Promise<{ sent: number; failed: number }> {
  let sent = 0
  let failed = 0

  for (let i = 0; i < batch.length; i++) {
    const { name, email } = batch[i]
    const success = await sendSingleEmail(email, name, subject, message)
    if (success) sent++
    else failed++
    onProgress?.(i + 1, batch.length)

    // Small delay to avoid rate limiting
    if (i < batch.length - 1) {
      await new Promise(r => setTimeout(r, 200))
    }
  }

  return { sent, failed }
}

// ─── Queue Management (localStorage) ─────────────────────────────────────────

const QUEUE_KEY = 'mcan_email_queue'

export interface QueuedCampaign {
  id: string
  subject: string
  body: string
  batches: EmailRecipient[][]
  currentBatch: number
  createdAt: string
}

export function saveQueuedCampaign(campaign: QueuedCampaign): void {
  if (typeof window === 'undefined') return
  const existing = getQueuedCampaigns()
  const updated = existing.filter(c => c.id !== campaign.id)
  updated.push(campaign)
  localStorage.setItem(QUEUE_KEY, JSON.stringify(updated))
}

export function getQueuedCampaigns(): QueuedCampaign[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]')
  } catch {
    return []
  }
}

export function removeQueuedCampaign(id: string): void {
  if (typeof window === 'undefined') return
  const updated = getQueuedCampaigns().filter(c => c.id !== id)
  localStorage.setItem(QUEUE_KEY, JSON.stringify(updated))
}
