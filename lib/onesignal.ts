const ONESIGNAL_APP_ID  = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!
const ONESIGNAL_API_KEY = process.env.ONESIGNAL_REST_API_KEY!
const SITE_URL          = process.env.NEXT_PUBLIC_SITE_URL || ''

export interface NotificationPayload {
  title: string
  message: string
  url: string
  imageUrl?: string
}

export async function sendPushNotification(payload: NotificationPayload): Promise<boolean> {
  try {
    const res = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${ONESIGNAL_API_KEY}`,
      },
      body: JSON.stringify({
        app_id:            ONESIGNAL_APP_ID,
        included_segments: ['All'],
        headings:          { en: payload.title },
        contents:          { en: payload.message },
        url:               payload.url,
        // MCAN logo as notification icon
        chrome_web_icon:   `${SITE_URL}/images/logo.jpg`,
        firefox_icon:      `${SITE_URL}/images/logo.jpg`,
        // Large image if provided
        ...(payload.imageUrl && {
          big_picture:      payload.imageUrl,
          chrome_web_image: payload.imageUrl,
        }),
      }),
    })

    const data = await res.json()

    if (data.errors) {
      console.error('OneSignal errors:', data.errors)
      return false
    }

    console.log('✅ Notification sent to', data.recipients, 'subscribers')
    return true
  } catch (err) {
    console.error('Push notification failed:', err)
    return false
  }
}