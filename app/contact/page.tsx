import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Phone, Mail, MessageCircle, Instagram, Facebook, Twitter, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with MCAN Oyo State.',
}

async function getSettings() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.from('site_settings').select('key,value')
  const map: Record<string, string> = {}
  data?.forEach(({ key, value }) => { map[key] = value ?? '' })
  return map
}

export default async function ContactPage() {
  const settings = await getSettings()

  return (
    <div>
      <section className="islamic-bg-dark py-14 px-4 text-center">
        <span className="section-label text-gold-300">Reach Us</span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-3 mb-3">Contact MCAN Oyo</h1>
        <p className="text-green-200 font-body max-w-md mx-auto text-sm">
          We're here to help. Reach out through any of the channels below.
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">

          {/* Contact Info */}
          <div className="space-y-5">
            <div className="card p-6">
              <h2 className="font-display text-xl font-semibold text-primary-800 mb-5">Get In Touch</h2>
              <ul className="space-y-4">
                {settings.ameer_phone && (
                  <li>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-body mb-1">
                      Ameer's Line ({settings.ameer_name || 'Ameer'})
                    </p>
                    <a href={`tel:${settings.ameer_phone}`}
                      className="flex items-center gap-3 text-sm font-medium text-primary-700 hover:text-primary-900 font-body">
                      <Phone size={16} className="text-gold-500" />
                      {settings.ameer_phone}
                    </a>
                  </li>
                )}
                {settings.email && (
                  <li>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-body mb-1">Email</p>
                    <a href={`mailto:${settings.email}`}
                      className="flex items-center gap-3 text-sm font-medium text-primary-700 hover:text-primary-900 font-body">
                      <Mail size={16} className="text-gold-500" />
                      {settings.email}
                    </a>
                  </li>
                )}
                {settings.whatsapp && (
                  <li>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-body mb-1">WhatsApp</p>
                    <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm font-medium text-primary-700 hover:text-primary-900 font-body">
                      <MessageCircle size={16} className="text-gold-500" />
                      {settings.whatsapp}
                    </a>
                  </li>
                )}
                {settings.address && (
                  <li>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-body mb-1">Address</p>
                    <div className="flex items-start gap-3 text-sm text-gray-600 font-body">
                      <MapPin size={16} className="text-gold-500 flex-shrink-0 mt-0.5" />
                      {settings.address}
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {/* Social Media */}
            <div className="card p-6">
              <h3 className="font-display text-lg font-semibold text-primary-800 mb-4">Follow Us</h3>
              <div className="space-y-3">
                {settings.instagram && (
                  <a href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-700 hover:text-primary-700 font-body transition-colors">
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                      <Instagram size={16} className="text-pink-600" />
                    </div>
                    {settings.instagram}
                  </a>
                )}
                {settings.facebook && (
                  <a href={`https://facebook.com/${settings.facebook}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-700 hover:text-primary-700 font-body transition-colors">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Facebook size={16} className="text-blue-600" />
                    </div>
                    {settings.facebook}
                  </a>
                )}
                {settings.twitter && (
                  <a href={`https://twitter.com/${settings.twitter.replace('@', '')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-700 hover:text-primary-700 font-body transition-colors">
                    <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                      <Twitter size={16} className="text-sky-600" />
                    </div>
                    {settings.twitter}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-5">
            <div className="card p-6">
              <h3 className="font-display text-xl font-semibold text-primary-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { href: '/register', label: 'Register as a Corps Member', desc: 'Join MCAN for the current service year' },
                  { href: '/lgi',      label: 'Find your LGI/MCLO',          desc: 'Contact your local government officer' },
                  { href: '/lodges',   label: 'Find a Lodge',                 desc: 'Locate the nearest MCAN lodge' },
                  { href: '/donate',   label: 'Make a Donation',              desc: 'Support MCAN\'s activities' },
                ].map(({ href, label, desc }) => (
                  <a key={href} href={href}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-primary-50 border border-transparent hover:border-primary-200 transition-colors group">
                    <div>
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-primary-800 font-body">{label}</p>
                      <p className="text-xs text-gray-500 font-body mt-0.5">{desc}</p>
                    </div>
                    <span className="text-primary-400 group-hover:text-primary-600">›</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-primary-700 rounded-xl p-6 text-center">
              <p className="font-arabic text-white text-lg leading-loose mb-2">
                وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ
              </p>
              <p className="text-green-200 text-xs font-body italic">
                "And cooperate in righteousness and piety." — Quran 5:2
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
