'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Lock, Mail } from 'lucide-react'

export default function AdminLoginPage() {
  const router   = useRouter()
  const supabase = createClient()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)

async function handleLogin(e: React.FormEvent) {
  e.preventDefault()
  setLoading(true)
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    if (!data.session) throw new Error('No session returned')

    toast.success('Welcome back!')
    window.location.replace('/admin')
  } catch (err: any) {
    toast.error(err.message || 'Invalid credentials')
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen islamic-bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-gold-300" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-white">Admin Panel</h1>
          <p className="text-green-300 text-sm font-body mt-1">MCAN Oyo State</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <label className="form-label">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" mr-4 />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="form-input pl-9"
                placeholder="admin@mcan.org"
                required
              />
            </div>
          </div>
          <div>
            <label className="form-label">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" mr-4 />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-input pl-9"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-green-400/60 mt-6 font-body">
          MCAN Oyo State — Admin Access Only
        </p>
      </div>
    </div>
  )
}
