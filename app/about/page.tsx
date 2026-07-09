import type { Metadata } from 'next'
import { Target, Eye, Megaphone, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About MCAN',
  description: 'Learn about the Muslim Corpers\' Association of Nigeria — history, mission, vision, and programmes.',
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="islamic-bg-dark py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="section-label text-gold-300">About Us</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-3 mb-4">
            Muslim Corpers'<br />Association of Nigeria
          </h1>
          <p className="font-arabic text-gold-300 text-2xl leading-loose">
            خِدْمَةُ الإِسْلَامِ مِنْ خِلَالِ الأُمَّةِ
          </p>
          <p className="text-green-200 font-body mt-2 text-sm italic">Serving Islam through the Nation</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 space-y-14">

        {/* Overview */}
        <section>
          <div className="divider-ornament">
            <span className="font-arabic text-gold-500 text-lg">بِسْمِ اللَّهِ</span>
          </div>
          <div className="prose max-w-none font-body text-gray-700 leading-relaxed space-y-4">
            <p>
              <strong className="text-primary-800 font-display text-lg">MCAN</strong> is an acronym for the 
              <em> Muslim Corpers' Association of Nigeria</em> and has for more than four decades achieved 
              a very close relationship with Muslim graduates who have successfully qualified for the one-year 
              National Youth Service in the various states of the Federation.
            </p>
            <p>
              The National Youth Service Corps (NYSC) scheme, brought to limelight by Decree No. 24 of 1973, 
              made possible in Nigeria the deployment of eligible graduates from universities and other relevant 
              institutions of higher learning to undertake national service in states other than their state of 
              origin. This made it possible for fresh Muslim graduates to gather under a platform to organise 
              and coordinate themselves for the purposes of collectively carrying out Islamic responsibilities — 
              hence the formation of MCAN.
            </p>
            <p>
              The Association was inaugurated during the <strong>1978/1979</strong> service year. It has its 
              National Headquarters in Mabushi, Abuja, with branches across all 36 states of the Federation 
              including the FCT. MCAN was registered under the Corporate Affairs Commission of Nigeria in 
              <strong> 1994</strong>.
            </p>
          </div>
        </section>

        {/* Mission / Vision / Slogan */}
        <section className="grid sm:grid-cols-3 gap-5">
          {[
            {
              icon: Target,
              label: 'Mission',
              text: 'Adherence to the pristine teachings of Islam in all affairs of life.',
              color: 'text-primary-700',
              bg: 'bg-primary-50 border-primary-200',
            },
            {
              icon: Eye,
              label: 'Vision',
              text: 'Towards achieving an ideal, morally-bounded Islamic society.',
              color: 'text-gold-700',
              bg: 'bg-gold-50 border-gold-200',
            },
            {
              icon: Megaphone,
              label: 'Slogan',
              text: 'Serving Islam (Allah) through the Nation.',
              color: 'text-teal-700',
              bg: 'bg-teal-50 border-teal-200',
            },
          ].map(({ icon: Icon, label, text, color, bg }) => (
            <div key={label} className={`rounded-xl p-6 border ${bg} text-center`}>
              <Icon size={28} className={`${color} mx-auto mb-3`} />
              <h3 className={`font-display text-xl font-semibold ${color} mb-2`}>{label}</h3>
              <p className="text-sm text-gray-600 font-body leading-relaxed">{text}</p>
            </div>
          ))}
        </section>

        {/* Aims & Objectives */}
        <section>
          <span className="section-label">Aims & Objectives</span>
          <h2 className="section-title mt-1 mb-6">What We Stand For</h2>
          <div className="space-y-4">
            {[
              'To serve as a coordinating body and a forum for the exchange of ideas between Muslim corps members in all parts of the federation.',
              'To fight and protect the legitimate interests and rights of all Muslim youth corps members in the country.',
              'To promote better understanding of Islam among Muslim corps members, students, and the rest of the populace with a view to having a more dedicated and unified Ummah.',
              'To coordinate the efforts of various Islamic organizations in the propagation of Islam in Nigeria and throughout the world.',
            ].map((obj, i) => (
              <div key={i} className="flex gap-4 card p-5">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 font-bold text-sm font-display">{i + 1}</span>
                </div>
                <p className="text-gray-700 font-body leading-relaxed">{obj}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Programmes */}
        <section>
          <span className="section-label">Programmes</span>
          <h2 className="section-title mt-1 mb-4">Our Programmes</h2>
          <p className="text-gray-600 font-body mb-8 leading-relaxed">
            MCAN's programmes are aligned with the NYSC calendar to allow members participate fully in 
            national service while contributing to personal and community development.
          </p>

          <div className="space-y-6">
            {[
              {
                title: 'Pre-Orientation Programme',
                desc: 'Aimed at raising the consciousness of potential corps members in institutions within the country. MCAN liaises with the Muslim Students\' Society of Nigeria (MSSN) to jointly organise seminars and distribute pamphlets, starting 2–3 months before orientation.',
                items: ['Seminars in universities across the country', 'Distribution of informational pamphlets', 'Collaboration with MSSN branches'],
              },
              {
                title: 'Orientation Programme',
                desc: 'Commences as orientation camps open across the country. Objectives include identifying and mobilising Muslim corps members and providing an atmosphere for Islamic personal development.',
                items: ['Lectures by MCAN representatives on camp', 'Posters, banners and mosque activity boards', "Regular Da'wah in mosques covering 'Aqeedah, 'Ibaadah and Mu'amalaat", 'Islamic video shows', 'Qur\'an memorisation sessions', 'Minor humanitarian works on camp'],
              },
              {
                title: 'Post-Orientation Activities',
                desc: 'Runs from after orientation until the passing-out parade. Divided into educational/da\'wah, visitation, and community development programmes.',
                items: [
                  'Weekly Al-Usrah programme',
                  'Arabic and Qur\'anic classes',
                  'Village weekend Da\'wah',
                  'Radio and TV programmes in 16+ states',
                  'Monthly bulletin publishing',
                  'Classes for reverts to Islam',
                  'Free tutorial classes in secondary schools (12+ states)',
                  'Prison visitation every Friday / monthly',
                  'Motherless babies home visits (bi-annually)',
                  'Mosque and Arabic school renovation/construction',
                  'Islamic video clubs and book centres',
                ],
              },
            ].map(({ title, desc, items }) => (
              <div key={title} className="card p-6">
                <h3 className="font-display text-xl font-semibold text-primary-800 mb-2">{title}</h3>
                <p className="text-gray-600 font-body text-sm leading-relaxed mb-4">{desc}</p>
                <ul className="grid sm:grid-cols-2 gap-1.5">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-700 font-body">
                      <CheckCircle size={14} className="text-primary-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8">
          <div className="divider-ornament mb-8">
            <span className="font-arabic text-gold-500 text-lg">وَاللَّهُ مَعَنَا</span>
          </div>
          <h3 className="font-display text-2xl font-semibold text-primary-800 mb-3">Join MCAN Oyo State</h3>
          <p className="text-gray-600 font-body mb-6">Are you a Muslim corps member serving in Oyo State? Register today.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="btn-primary">Register as a Corps Member</Link>
            <Link href="/contact" className="btn-outline-2">Contact Us</Link>
          </div>
        </section>

      </div>
    </div>
  )
}
