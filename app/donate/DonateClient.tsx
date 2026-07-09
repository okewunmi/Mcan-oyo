'use client'

import { useState } from 'react'
import { Heart, Copy, CheckCircle, CreditCard, Repeat, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'

const CAUSES = [
  { icon: '🕌', title: 'Mosque Renovation',  desc: 'Help us renovate and build mosques in underserved communities.' },
  { icon: '📚', title: 'Arabic Schools',      desc: "Fund Qur'anic and Arabic classes for community children." },
  { icon: '🏠', title: 'Lodge Maintenance',   desc: 'Keep MCAN lodges safe and functional for corps members.' },
  { icon: '📢', title: "Da'wah Activities",   desc: 'Support radio programmes, pamphlets, and outreach events.' },
  { icon: '🎓', title: 'Tutorial Classes',    desc: 'Free tutorial classes for secondary school students.' },
  { icon: '🤲', title: 'Prison & Charity',    desc: "Jumu'ah services, gifts, and visits to motherless babies' homes." },
]

interface BankAccount {
  id: string
  bank_name: string
  account_name: string
  account_number: string
  description?: string
}

export default function DonateClient({ accounts }: { accounts: BankAccount[] }) {
  const [type, setType]           = useState<'once' | 'monthly'>('once')
  const [copiedId, setCopiedId]   = useState<string | null>(null)
  const [activeAccount, setActiveAccount] = useState(0)

  function copyAccount(id: string, number: string) {
    navigator.clipboard.writeText(number)
    setCopiedId(id)
    toast.success('Account number copied!')
    setTimeout(() => setCopiedId(null), 3000)
  }

  return (
    <div>
      {/* Hero */}
      <section className="islamic-bg-dark py-16 px-4 text-center">
        <div className="w-16 h-16 mx-auto mb-5 bg-gold-500/20 rounded-full flex items-center justify-center">
          <Heart size={28} className="text-gold-300" />
        </div>
        <span className="section-label text-gold-300">Sadaqah Jariyah</span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-3 mb-4">
          Support MCAN Oyo State
        </h1>
        <p className="font-arabic text-gold-300 text-xl leading-loose mb-2">
          مَن ذَا الَّذِي يُقْرِضُ اللَّهَ قَرْضًا حَسَنًا
        </p>
        <p className="text-green-300/80 text-xs font-body italic mb-4">
          "Who will lend Allah a goodly loan?" — Quran 2:245
        </p>
        <p className="text-green-200 font-body max-w-xl mx-auto text-sm leading-relaxed">
          Your donation keeps da'wah alive across all 33 local governments of Oyo State.
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">

        {/* Donation type toggle */}
        <div className="flex justify-center gap-3">
          {(['once', 'monthly'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold font-body transition-all border-2 ${
                type === t
                  ? 'bg-primary-700 text-white border-primary-700'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
              }`}
            >
              {t === 'once' ? <CreditCard size={15} /> : <Repeat size={15} />}
              {t === 'once' ? 'One-time' : 'Monthly'}
            </button>
          ))}
        </div>

        {/* Account selector tabs */}
        {accounts.length > 1 && (
          <div className="flex gap-2 justify-center flex-wrap">
            {accounts.map((acc, i) => (
              <button
                key={acc.id}
                onClick={() => setActiveAccount(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body font-medium border transition-all ${
                  activeAccount === i
                    ? 'bg-primary-50 border-primary-300 text-primary-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-primary-200'
                }`}
              >
                <Building2 size={14} />
                {acc.bank_name}
              </button>
            ))}
          </div>
        )}

        {/* Active account card */}
        {accounts.length > 0 && (
          <div className="card p-6 sm:p-8 max-w-lg mx-auto">
            <h2 className="font-display text-2xl font-semibold text-primary-800 mb-1 text-center">
              {type === 'monthly' ? 'Monthly Standing Order' : 'Bank Transfer Details'}
            </h2>
            {accounts[activeAccount].description && (
              <p className="text-xs text-center text-gray-400 font-body mb-5">
                {accounts[activeAccount].description}
              </p>
            )}
            {type === 'monthly' && (
              <p className="text-sm text-gray-500 text-center font-body mb-5">
                Set up a standing order with your bank using the details below.
              </p>
            )}

            <div className="space-y-4 mt-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-body mb-1">Bank Name</p>
                <p className="font-semibold text-gray-800 font-body">{accounts[activeAccount].bank_name}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-body mb-1">Account Name</p>
                <p className="font-semibold text-gray-800 font-body">{accounts[activeAccount].account_name}</p>
              </div>
              <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-primary-500 uppercase tracking-wide font-body mb-1">Account Number</p>
                  <p className="text-2xl font-bold text-primary-800 font-display tracking-wider">
                    {accounts[activeAccount].account_number}
                  </p>
                </div>
                <button
                  onClick={() => copyAccount(accounts[activeAccount].id, accounts[activeAccount].account_number)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-body font-medium transition-all ${
                    copiedId === accounts[activeAccount].id
                      ? 'bg-green-100 text-green-700'
                      : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                  }`}
                >
                  {copiedId === accounts[activeAccount].id
                    ? <><CheckCircle size={14} /> Copied!</>
                    : <><Copy size={14} /> Copy</>
                  }
                </button>
              </div>
            </div>

            {/* Show all accounts summary if multiple */}
            {accounts.length > 1 && (
              <div className="mt-5 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-body mb-3">
                  All Accounts
                </p>
                <div className="space-y-2">
                  {accounts.map((acc, i) => (
                    <div key={acc.id}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                        activeAccount === i ? 'bg-primary-100' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveAccount(i)}
                    >
                      <div>
                        <p className="text-xs font-semibold text-gray-700 font-body">{acc.bank_name}</p>
                        <p className="text-xs text-gray-400 font-body font-mono">{acc.account_number}</p>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); copyAccount(acc.id, acc.account_number) }}
                        className="text-xs text-primary-600 hover:text-primary-800 font-body"
                      >
                        {copiedId === acc.id ? '✓' : 'Copy'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 p-4 bg-gold-50 border border-gold-200 rounded-lg">
              <p className="text-xs text-gold-700 font-body leading-relaxed">
                Your donation sustains mosques, Arabic schools, lodge maintenance, and Da'wah
                activities across Oyo State. May Allah accept it as Sadaqah Jariyah.
              </p>
            </div>

            {type === 'monthly' && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700 font-body">
                  <strong>Tip:</strong> After setting up your standing order, send us a WhatsApp message
                  so we can acknowledge your contribution.{' '}
                  <a href="https://wa.me/2348166271577" target="_blank" rel="noopener noreferrer" className="underline">
                    Message us →
                  </a>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Causes */}
        <section>
          <div className="text-center mb-8">
            <span className="section-label">Impact</span>
            <h2 className="section-title mt-1">Where Your Donation Goes</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CAUSES.map(({ icon, title, desc }) => (
              <div key={title} className="card p-5">
                <span className="text-3xl mb-3 block">{icon}</span>
                <h3 className="font-display text-lg font-semibold text-primary-800 mb-1.5">{title}</h3>
                <p className="text-sm text-gray-600 font-body leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="bg-primary-700 rounded-2xl p-8 text-center">
          <p className="font-arabic text-white text-2xl leading-loose mb-3">
            إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ: صَدَقَةٌ جَارِيَةٌ
          </p>
          <p className="text-green-200 font-body text-sm italic">
            "When a person dies, all their deeds end except three: ongoing charity (Sadaqah Jariyah)..."
            — Sahih Muslim
          </p>
        </div>
      </div>
    </div>
  )
}