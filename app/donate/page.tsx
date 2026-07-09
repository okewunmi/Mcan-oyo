// 'use client'

// import { useState } from 'react'
// import { Heart, Copy, CheckCircle, CreditCard, Repeat } from 'lucide-react'
// import toast from 'react-hot-toast'

// const DONATION_INFO = {
//   bank_name:      'First Bank of Nigeria',
//   account_name:   'Muslim Corpers Association Oyo',
//   account_number: '1234567890',
//   note: "Your donation sustains mosques, Arabic schools, lodge maintenance, and Da'wah activities across Oyo State. May Allah accept it as Sadaqah Jariyah.",
// }

// const CAUSES = [
//   { icon: '🕌', title: 'Mosque Renovation',    desc: 'Help us renovate and build mosques in underserved communities.' },
//   { icon: '📚', title: 'Arabic Schools',        desc: 'Fund Qur\'anic and Arabic classes for community children.' },
//   { icon: '🏠', title: 'Lodge Maintenance',     desc: 'Keep MCAN lodges safe and functional for corps members.' },
//   { icon: '📢', title: "Da'wah Activities",    desc: 'Support radio programmes, pamphlets, and outreach events.' },
//   { icon: '🎓', title: 'Tutorial Classes',      desc: 'Free tutorial classes for secondary school students.' },
//   { icon: '🤲', title: 'Prison & Charity',      desc: 'Jumu\'ah services, gifts, and visits to motherless babies\' homes.' },
// ]

// export default function DonatePage() {
//   const [copied, setCopied] = useState(false)
//   const [type, setType]     = useState<'once' | 'monthly'>('once')

//   function copyAccount() {
//     navigator.clipboard.writeText(DONATION_INFO.account_number)
//     setCopied(true)
//     toast.success('Account number copied!')
//     setTimeout(() => setCopied(false), 3000)
//   }

//   return (
//     <div>
//       {/* Hero */}
//       <section className="islamic-bg-dark py-16 px-4 text-center">
//         <div className="w-16 h-16 mx-auto mb-5 bg-gold-500/20 rounded-full flex items-center justify-center">
//           <Heart size={28} className="text-gold-300" />
//         </div>
//         <span className="section-label text-gold-300">Sadaqah Jariyah</span>
//         <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-3 mb-4">
//           Support MCAN Oyo State
//         </h1>
//         <p className="font-arabic text-gold-300 text-xl leading-loose mb-2">
//           مَن ذَا الَّذِي يُقْرِضُ اللَّهَ قَرْضًا حَسَنًا
//         </p>
//         <p className="text-green-300/80 text-xs font-body italic mb-4">
//           "Who will lend Allah a goodly loan?" — Quran 2:245
//         </p>
//         <p className="text-green-200 font-body max-w-xl mx-auto text-sm leading-relaxed">
//           Your donation keeps da'wah alive across all 33 local governments of Oyo State. 
//           Every naira is an investment in the Hereafter.
//         </p>
//       </section>

//       <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">

//         {/* Donation type toggle */}
//         <div className="flex justify-center gap-3">
//           <button
//             onClick={() => setType('once')}
//             className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold font-body transition-all border-2 ${
//               type === 'once'
//                 ? 'bg-primary-700 text-white border-primary-700'
//                 : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
//             }`}
//           >
//             <CreditCard size={15} /> One-time
//           </button>
//           <button
//             onClick={() => setType('monthly')}
//             className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold font-body transition-all border-2 ${
//               type === 'monthly'
//                 ? 'bg-primary-700 text-white border-primary-700'
//                 : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
//             }`}
//           >
//             <Repeat size={15} /> Monthly
//           </button>
//         </div>

//         {/* Account Details Card */}
//         <div className="card p-6 sm:p-8 max-w-lg mx-auto">
//           <h2 className="font-display text-2xl font-semibold text-primary-800 mb-2 text-center">
//             {type === 'monthly' ? 'Monthly Standing Order' : 'Bank Transfer Details'}
//           </h2>
//           {type === 'monthly' && (
//             <p className="text-sm text-gray-500 text-center font-body mb-5">
//               Set up a standing order with your bank using the details below to donate automatically each month.
//             </p>
//           )}

//           <div className="space-y-4 mt-5">
//             <div className="bg-gray-50 rounded-lg p-4">
//               <p className="text-xs text-gray-400 uppercase tracking-wide font-body mb-1">Bank Name</p>
//               <p className="font-semibold text-gray-800 font-body">{DONATION_INFO.bank_name}</p>
//             </div>
//             <div className="bg-gray-50 rounded-lg p-4">
//               <p className="text-xs text-gray-400 uppercase tracking-wide font-body mb-1">Account Name</p>
//               <p className="font-semibold text-gray-800 font-body">{DONATION_INFO.account_name}</p>
//             </div>
//             <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-4 flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-primary-500 uppercase tracking-wide font-body mb-1">Account Number</p>
//                 <p className="text-2xl font-bold text-primary-800 font-display tracking-wider">
//                   {DONATION_INFO.account_number}
//                 </p>
//               </div>
//               <button
//                 onClick={copyAccount}
//                 className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-body font-medium transition-all ${
//                   copied
//                     ? 'bg-green-100 text-green-700'
//                     : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
//                 }`}
//               >
//                 {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
//                 {copied ? 'Copied!' : 'Copy'}
//               </button>
//             </div>
//           </div>

//           <div className="mt-5 p-4 bg-gold-50 border border-gold-200 rounded-lg">
//             <p className="text-xs text-gold-700 font-body leading-relaxed">{DONATION_INFO.note}</p>
//           </div>

//           {type === 'monthly' && (
//             <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//               <p className="text-xs text-blue-700 font-body">
//                 <strong>Tip:</strong> After setting up your standing order, please send a WhatsApp message to 
//                 inform us so we can acknowledge your contribution.
//                 <a href="https://wa.me/2348012345678" target="_blank" rel="noopener noreferrer"
//                   className="underline ml-1">Message us →</a>
//               </p>
//             </div>
//           )}
//         </div>

//         {/* What your donation supports */}
//         <section>
//           <div className="text-center mb-8">
//             <span className="section-label">Impact</span>
//             <h2 className="section-title mt-1">Where Your Donation Goes</h2>
//           </div>
//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {CAUSES.map(({ icon, title, desc }) => (
//               <div key={title} className="card p-5">
//                 <span className="text-3xl mb-3 block">{icon}</span>
//                 <h3 className="font-display text-lg font-semibold text-primary-800 mb-1.5">{title}</h3>
//                 <p className="text-sm text-gray-600 font-body leading-relaxed">{desc}</p>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Hadith on charity */}
//         <div className="bg-primary-700 rounded-2xl p-8 text-center">
//           <p className="font-arabic text-white text-2xl leading-loose mb-3">
//             إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ: صَدَقَةٌ جَارِيَةٌ
//           </p>
//           <p className="text-green-200 font-body text-sm italic">
//             "When a person dies, all their deeds end except three: ongoing charity (Sadaqah Jariyah)..." 
//             — Sahih Muslim
//           </p>
//         </div>

//       </div>
//     </div>
//   )
// }


import { createServerSupabaseClient } from '@/lib/supabase-server'
import DonateClient from './DonateClient'

async function getBankAccounts() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('bank_accounts')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  // Fallback if table empty
  if (!data || data.length === 0) {
    return [
      { id: '1', bank_name: 'First Bank of Nigeria', account_name: 'Muslim Corpers Association Oyo', account_number: '1234567890', description: 'Main donations account' },
    ]
  }
  return data
}

export default async function DonatePage() {
  const accounts = await getBankAccounts()
  return <DonateClient accounts={accounts} />
}