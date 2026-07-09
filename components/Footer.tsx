// import Link from 'next/link'
// import { Phone, Mail, Instagram, Facebook, Twitter, MessageCircle, Heart } from 'lucide-react'

// export default function Footer() {
//   const year = new Date().getFullYear()

//   return (
//     <footer className="islamic-bg-dark text-white mt-16">

//       {/* Donate CTA Banner */}
//       <div className="bg-gold-500 py-5 px-4">
//         <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
//           <div>
//             <p className="font-display text-xl font-semibold text-white">Support Da'wah in Oyo State</p>
//             <p className="text-sm text-white/90 font-body mt-0.5">Your donation sustains mosques, Arabic schools &amp; community development</p>
//           </div>
//           <Link
//             href="/donate"
//             className="flex-shrink-0 bg-white text-gold-700 px-6 py-2.5 rounded-md font-semibold text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
//           >
//             <Heart size={16} />
//             Donate Now
//           </Link>
//         </div>
//       </div>

//       {/* Main Footer */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

//           {/* Brand */}
//           <div className="lg:col-span-1">
//             <div className="flex items-center gap-3 mb-4">
//               <Link href="/" className="flex items-center gap-3 flex-shrink-0">
//               <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-100 bg-primary-700 flex items-center justify-center">
//                 <img
//                   src="/images/logo.jpg"
//                   alt="MCAN Oyo"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               </Link>
//               <div>
//                 <p className="font-display font-semibold text-white text-lg leading-tight">MCAN Oyo State</p>
//                 <p className="text-xs text-green-300 font-body">Muslim Corpers' Association</p>
//               </div>
//             </div>
//             <p className="text-sm text-green-200 font-body leading-relaxed">
//               Serving Islam through the Nation. Empowering Muslim corps members across all 33 local governments of Oyo State.
//             </p>
//             <div className="mt-4 flex items-center gap-2 flex-wrap">
//               <span className="text-xs text-green-300/70 font-body italic">"إنما الأعمال بالنيات"</span>
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h4 className="font-display text-lg font-semibold text-white mb-4">Quick Links</h4>
//             <ul className="space-y-2">
//               {[
//                 { href: '/about',      label: 'About MCAN' },
//                 { href: '/daily',      label: 'Daily Content' },
//                  { href: '/executives', label: 'Executives' },
//                 { href: '/lgi',        label: 'LGI & MCLO' },
//                 { href: '/events',     label: 'Events' },
//                 { href: '/news',       label: 'News' },
//                 { href: '/projects',   label: 'Projects' },
//                 { href: '/lodges',     label: 'Lodge Finder' },
//                 { href: '/register',   label: 'Register Now' },
//                 { href: '/donate',     label: 'Donate' },
//                 { href: '/contact',    label: 'Contact Us' },
//                 { href: '/faq', label: 'FAQs' },
//               ].map((l) => (
//                 <li key={l.href}>
//                   <Link
//                     href={l.href}
//                     className="text-sm text-green-200 hover:text-white transition-colors font-body flex items-center gap-1"
//                   >
//                     <span className="text-gold-400">›</span> {l.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Daily Content Schedule */}
//           <div>
//             <h4 className="font-display text-lg font-semibold text-white mb-4">Daily Content</h4>
//             <ul className="space-y-1.5 text-sm text-green-200 font-body">
//               <li><span className="text-gold-400 font-semibold">Mon</span> — Hadith</li>
//               <li><span className="text-gold-400 font-semibold">Tue</span> — Azkar</li>
//               <li><span className="text-gold-400 font-semibold">Wed</span> — Tawheed</li>
//               <li><span className="text-gold-400 font-semibold">Thu</span> — Fiqh</li>
//               <li><span className="text-gold-400 font-semibold">Fri</span> — Jumu'ah Rites</li>
//               <li><span className="text-gold-400 font-semibold">Sat</span> — Prophet's Companions</li>
//               <li><span className="text-gold-400 font-semibold">Sun</span> — Qur'an Stories</li>
//             </ul>
//             <Link
//               href="/daily"
//               className="mt-4 inline-flex items-center text-xs text-gold-400 hover:text-gold-300 transition-colors font-body"
//             >
//               View today's content →
//             </Link>
//           </div>

//           {/* Contact */}
//           <div>
//             <h4 className="font-display text-lg font-semibold text-white mb-4">Get In Touch</h4>
//             <ul className="space-y-3">
//               <li>
//                 <a href="tel:+2348012345678" className="flex items-center gap-2.5 text-sm text-green-200 hover:text-white transition-colors font-body">
//                   <Phone size={15} className="text-gold-400 flex-shrink-0" />
//                   Ameer: +234 8166271577
//                 </a>
//               </li>
//               <li>
//                 <a href="mailto:oyostatemcan@gmail.com" className="flex items-center gap-2.5 text-sm text-green-200 hover:text-white transition-colors font-body">
//                   <Mail size={15} className="text-gold-400 flex-shrink-0" />
//                   oyostatemcan@gmail.com
//                 </a>
//               </li>
//               <li>
//                 <a href="https://wa.me/2348012345678" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-green-200 hover:text-white transition-colors font-body">
//                   <MessageCircle size={15} className="text-gold-400 flex-shrink-0" />
//                   WhatsApp
//                 </a>
//               </li>
//             </ul>
//             <div className="flex items-center gap-3 mt-5">
//               <a href="https://instagram.com/mcan_oyo" target="_blank" rel="noopener noreferrer"
//                 className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold-500 transition-colors">
//                 <Instagram size={15} />
//               </a>
//               <a href="https://facebook.com/mcan.oyo" target="_blank" rel="noopener noreferrer"
//                 className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold-500 transition-colors">
//                 <Facebook size={15} />
//               </a>
//               <a href="https://twitter.com/mcan_oyo" target="_blank" rel="noopener noreferrer"
//                 className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold-500 transition-colors">
//                 <Twitter size={15} />
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Bar */}
//         <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-green-300/70 font-body">
//           <p>© {year} MCAN Oyo State. All rights reserved.</p>
//           <p className="font-arabic text-base text-green-300/50">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
//           <Link href="/login" className="hover:text-white transition-colors">Admin</Link>
//         </div>
//       </div>
//     </footer>
//   )
// }




import Link from 'next/link'
import { Phone, Mail, Instagram, Facebook, Twitter, MessageCircle, Heart } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="islamic-bg-dark text-white mt-16">

      {/* Donate CTA Banner */}
      <div className="bg-gold-500 py-5 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-display text-xl font-semibold text-white">Support Da'wah in Oyo State</p>
            <p className="text-sm text-white/90 font-body mt-0.5">Your donation sustains mosques, Arabic schools &amp; community development</p>
          </div>
          <Link
            href="/donate"
            className="flex-shrink-0 bg-white text-gold-700 px-6 py-2.5 rounded-md font-semibold text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Heart size={16} />
            Donate Now
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-100 bg-primary-700 flex items-center justify-center">
                <img
                  src="/images/logo.jpg"
                  alt="MCAN Oyo"
                  className="w-full h-full object-cover"
                />
              </div>
              </Link>
              <div>
                <p className="font-display font-semibold text-white text-lg leading-tight">MCAN Oyo State</p>
                <p className="text-xs text-green-300 font-body">Muslim Corpers' Association</p>
              </div>
            </div>
            <p className="text-sm text-green-200 font-body leading-relaxed">
              Serving Islam through the Nation. Empowering Muslim corps members across all 33 local governments of Oyo State.
            </p>
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-green-300/70 font-body italic">"إنما الأعمال بالنيات"</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: '/about',      label: 'About MCAN' },
                { href: '/daily',      label: 'Daily Content' },
                 { href: '/executives', label: 'Executives' },
                { href: '/lgi',        label: 'LGI & MCLO' },
                { href: '/events',     label: 'Events' },
                { href: '/news',       label: 'News' },
                { href: '/projects',   label: 'Projects' },
                { href: '/lodges',     label: 'Lodge Finder' },
                { href: '/register',   label: 'Register Now' },
                { href: '/donate',     label: 'Donate' },
                { href: '/contact',    label: 'Contact Us' },
                { href: '/faq', label: 'FAQs' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-green-200 hover:text-white transition-colors font-body flex items-center gap-1"
                  >
                    <span className="text-gold-400">›</span> {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Daily Content Schedule */}
          <div>
            <h4 className="font-display text-lg font-semibold text-white mb-4">Daily Content</h4>
            <ul className="space-y-1.5 text-sm text-green-200 font-body">
              <li><span className="text-gold-400 font-semibold">Mon</span> — Hadith</li>
              <li><span className="text-gold-400 font-semibold">Tue</span> — Azkar</li>
              <li><span className="text-gold-400 font-semibold">Wed</span> — Tawheed</li>
              <li><span className="text-gold-400 font-semibold">Thu</span> — Fiqh</li>
              <li><span className="text-gold-400 font-semibold">Fri</span> — Jumu'ah Rites</li>
              <li><span className="text-gold-400 font-semibold">Sat</span> — Prophet's Companions</li>
              <li><span className="text-gold-400 font-semibold">Sun</span> — Qur'an Stories</li>
            </ul>
            <Link
              href="/daily"
              className="mt-4 inline-flex items-center text-xs text-gold-400 hover:text-gold-300 transition-colors font-body"
            >
              View today's content →
            </Link>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold text-white mb-4">Get In Touch</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:+2348012345678" className="flex items-center gap-2.5 text-sm text-green-200 hover:text-white transition-colors font-body">
                  <Phone size={15} className="text-gold-400 flex-shrink-0" />
                  Ameer: +234 8166271577
                </a>
              </li>
              <li>
                <a href="mailto:oyostatemcan@gmail.com" className="flex items-center gap-2.5 text-sm text-green-200 hover:text-white transition-colors font-body">
                  <Mail size={15} className="text-gold-400 flex-shrink-0" />
                  oyostatemcan@gmail.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/2348012345678" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-green-200 hover:text-white transition-colors font-body">
                  <MessageCircle size={15} className="text-gold-400 flex-shrink-0" />
                  WhatsApp
                </a>
              </li>
            </ul>
            <div className="flex items-center gap-3 mt-5">
              <a href="https://instagram.com/mcan_oyo" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold-500 transition-colors">
                <Instagram size={15} />
              </a>
              <a href="https://facebook.com/mcan.oyo" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold-500 transition-colors">
                <Facebook size={15} />
              </a>
              <a href="https://twitter.com/mcan_oyo" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold-500 transition-colors">
                <Twitter size={15} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-green-300/70 font-body">
          <p>© {year} MCAN Oyo State. All rights reserved.</p>
          <p className="font-arabic text-base text-green-300/50">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          <Link href="/login" className="hover:text-white transition-colors">Admin</Link>
        </div>

        {/* Developer Credit */}
        <div className="mt-3 text-center text-xs text-green-300/60 font-body">
          <p>
            Developed by{' '}
            <a
              href="https://okewunmi.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-400 hover:text-gold-300 transition-colors font-medium"
            >
              Abdulafeez Okewunmi
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}