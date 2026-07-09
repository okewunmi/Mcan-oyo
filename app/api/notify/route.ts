// import { NextResponse } from 'next/server'
// import { sendPushNotification } from '@/lib/onesignal'

// export async function POST(request: Request) {
//   try {
//     const body = await request.json()
//     const { title, message, url, imageUrl } = body

//     if (!title || !message || !url) {
//       return NextResponse.json(
//         { error: 'title, message and url are required' },
//         { status: 400 }
//       )
//     }

//     const success = await sendPushNotification({ title, message, url, imageUrl })

//     return NextResponse.json({ success })
//   } catch (err: any) {
//     console.error('Notify route error:', err)
//     return NextResponse.json({ error: err.message }, { status: 500 })
//   }
// }

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, message, url, imageUrl } = body

    const APP_ID  = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID
    const API_KEY = process.env.ONESIGNAL_REST_API_KEY
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || ''

    // Return env check so we can see it in browser
    if (!APP_ID || !API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Missing env vars',
        hasAppId: !!APP_ID,
        hasApiKey: !!API_KEY,
      })
    }

    const res = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${API_KEY}`,
      },
      body: JSON.stringify({
        app_id:            APP_ID,
        included_segments: ['All'],
        headings:          { en: title },
        contents:          { en: message },
        url,
        chrome_web_icon:   `${SITE_URL}/images/logo.jpg`,
        ...(imageUrl && {
          big_picture:      imageUrl,
          chrome_web_image: imageUrl,
        }),
      }),
    })

    const data = await res.json()

    // Return full OneSignal response to browser for debugging
    return NextResponse.json({
      success: !data.errors,
      onesignal: data,         // ← full response visible in console
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}