export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import { Cormorant_Garamond, Outfit, Amiri } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import OneSignalProvider from '@/components/OneSignalProvider'
import { Toaster } from 'react-hot-toast'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
})

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-amiri',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: "MCAN Oyo State — Muslim Corpers' Association of Nigeria",
    template: '%s | MCAN Oyo State',
  },
  description:
    "Official website of Muslim Corpers' Association of Nigeria (MCAN), Oyo State chapter. Serving Islam through the Nation.",
  keywords: ['MCAN', 'Muslim Corpers', 'Oyo State', 'NYSC', 'Islamic', 'Nigeria'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MCAN Oyo',
  },
  openGraph: {
    title: 'MCAN Oyo State',
    description: 'Serving Islam through the Nation',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable} ${amiri.variable}`}>
      <head>
        <meta name="application-name" content="MCAN Oyo" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MCAN Oyo" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#145a32" />
        <link rel="apple-touch-icon" href="/images/logo.jpg" />
      </head>
      <body className="islamic-bg min-h-screen flex flex-col">
        <OneSignalProvider />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: 'var(--font-outfit)',
              borderRadius: '0.5rem',
            },
            success: { iconTheme: { primary: '#145a32', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  )
}