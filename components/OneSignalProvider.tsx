// 'use client'

// import { useEffect } from 'react'

// export default function OneSignalProvider() {
//   useEffect(() => {
//     if (typeof window === 'undefined') return

//     const appId       = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID
//     const safariWebId = process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID

//     if (!appId) return

//     const script = document.createElement('script')
//     script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js'
//     script.defer = true
//     script.onload = () => {
//       ;(window as any).OneSignalDeferred = (window as any).OneSignalDeferred || []
//       ;(window as any).OneSignalDeferred.push(async function (OneSignal: any) {
//         await OneSignal.init({
//           appId,
//           safari_web_id: safariWebId,
//           notifyButton: {
//             enable: true,
//             size: 'medium',
//             position: 'bottom-left',
//             showCredit: false,
//           },
//           promptOptions: {
//             slidedown: {
//               prompts: [
//                 {
//                   type: 'push',
//                   autoPrompt: true,
//                   text: {
//                     actionMessage: "Get notified about MCAN Oyo events, news and projects.",
//                     acceptButton: 'Allow',
//                     cancelButton: 'Later',
//                   },
//                   delay: {
//                     pageViews: 2,
//                     timeDelay: 5,
//                   },
//                 },
//               ],
//             },
//           },
//           welcomeNotification: {
//             title: 'MCAN Oyo State',
//             message: "Assalamu alaykum! You'll now receive updates on events and news.",
//             url: '/',
//           },
//         })
//       })
//     }
//     document.head.appendChild(script)
//   }, [])

//   return null
// }

'use client'

import { useEffect, useState } from 'react'
import { X, Share, PlusSquare } from 'lucide-react'

function isIOS() {
  if (typeof window === 'undefined') return false
  return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

function isInStandaloneMode() {
  if (typeof window === 'undefined') return false
  return ('standalone' in window.navigator) && (window.navigator as any).standalone
}

export default function OneSignalProvider() {
  const [showIOSBanner, setShowIOSBanner] = useState(false)

  useEffect(() => {
    // Show iOS install banner if on iOS and not already installed
    if (isIOS() && !isInStandaloneMode()) {
      const dismissed = sessionStorage.getItem('ios_banner_dismissed')
      if (!dismissed) {
        setTimeout(() => setShowIOSBanner(true), 3000)
      }
    }

    // OneSignal — only initialise on non-iOS or installed PWA
    if (isIOS() && !isInStandaloneMode()) return

    const appId       = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID
    const safariWebId = process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID
    if (!appId) return

    const script = document.createElement('script')
    script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js'
    script.defer = true
    script.onload = () => {
      ;(window as any).OneSignalDeferred = (window as any).OneSignalDeferred || []
      ;(window as any).OneSignalDeferred.push(async function (OneSignal: any) {
        await OneSignal.init({
          appId,
          safari_web_id: safariWebId,
          notifyButton: {
            enable: true,
            size: 'medium',
            position: 'bottom-left',
            showCredit: false,
          },
          promptOptions: {
            slidedown: {
              prompts: [
                {
                  type: 'push',
                  autoPrompt: true,
                  text: {
                    actionMessage: "Get notified about MCAN Oyo events, news and projects.",
                    acceptButton: 'Allow',
                    cancelButton: 'Later',
                  },
                  delay: {
                    pageViews: 2,
                    timeDelay: 5,
                  },
                },
              ],
            },
          },
          welcomeNotification: {
            title: 'MCAN Oyo State',
            message: "Assalamu alaykum! You'll now receive updates on events and news.",
            url: process.env.NEXT_PUBLIC_SITE_URL || '/',
          },
        })
      })
    }
    document.head.appendChild(script)
  }, [])

  function dismissBanner() {
    setShowIOSBanner(false)
    sessionStorage.setItem('ios_banner_dismissed', 'true')
  }

  if (!showIOSBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-up">
      <div className="max-w-sm mx-auto bg-primary-800 text-white rounded-2xl p-4 shadow-2xl border border-primary-600">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <img src="/images/logo.jpg" alt="MCAN" className="w-10 h-10 rounded-xl flex-shrink-0 object-cover" />
            <div>
              <p className="font-display text-sm font-semibold leading-tight mb-1">
                Add MCAN Oyo to Home Screen
              </p>
              <p className="text-xs text-green-200 font-body leading-relaxed">
                To receive event &amp; news notifications on iPhone/iPad, install this app first.
              </p>
            </div>
          </div>
          <button onClick={dismissBanner} className="text-white/60 hover:text-white flex-shrink-0">
            <X size={18} />
          </button>
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-green-300 font-body">
          <div className="flex items-center gap-1.5">
            <Share size={13} />
            <span>Tap Share</span>
          </div>
          <span className="text-white/30">→</span>
          <div className="flex items-center gap-1.5">
            <PlusSquare size={13} />
            <span>"Add to Home Screen"</span>
          </div>
          <span className="text-white/30">→</span>
          <span>Open app → Allow</span>
        </div>
      </div>
    </div>
  )
}