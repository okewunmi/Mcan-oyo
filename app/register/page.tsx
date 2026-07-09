'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { CheckCircle, UserPlus, Info } from 'lucide-react'

const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT-Abuja','Gombe',
  'Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos',
  'Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto',
  'Taraba','Yobe','Zamfara',
]

const currentYear = new Date().getFullYear()

export default function RegisterPage() {
  const supabase = createClient()
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [form, setForm] = useState({
    full_name: '',
    state_code: '',
    state_of_origin: '',
    phone: '',
    email: '',
    gender: '',
    batch: '',
    stream: '',
    ppa: '',
    lga_of_posting: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.full_name || !form.state_code || !form.email || !form.gender || !form.batch || !form.stream) {
      toast.error('Please fill all required fields.')
      return
    }

    const phoneRegex = /^(\+?234|0)[789][01]\d{8}$/
    if (!phoneRegex.test(form.phone.replace(/\s/g, ''))) {
      toast.error('Please enter a valid Nigerian phone number.')
      return
    }

    setLoading(true)
    try {
      // Check if email already registered this year
      const { data: existing } = await supabase
        .from('registrations')
        .select('id')
        .eq('email', form.email.toLowerCase())
        .eq('service_year', currentYear)
        .single()

      if (existing) {
        toast.error('This email is already registered for the current service year.')
        return
      }

      const { error } = await supabase.from('registrations').insert({
        ...form,
        email: form.email.toLowerCase(),
        service_year: currentYear,
      })

      if (error) throw error
      setSuccess(true)
      toast.success('Registration successful! Welcome to MCAN Oyo State!')
    } catch (err: any) {
      toast.error(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center card p-10">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-primary-600" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-primary-800 mb-3">
            Alhamdulillah! Registration Successful
          </h2>
          <p className="text-gray-600 font-body text-sm leading-relaxed mb-4">
            Welcome to MCAN Oyo State, {form.full_name.split(' ')[0]}! 
            You are now registered for the {currentYear} service year.
          </p>
          <p className="text-sm text-gray-500 font-body mb-6">
            Programme updates and event notifications will be sent to <strong>{form.email}</strong>.
          </p>
          <p className="font-arabic text-gold-500 text-xl">بَارَكَ اللَّهُ فِيكَ</p>
          <p className="text-xs text-gray-400 mt-1 font-body italic">May Allah bless you</p>
          <div className="mt-6 flex flex-col gap-2">
            <a href="/" className="btn-primary text-center justify-center">Go to Homepage</a>
            <a href="/daily" className="btn-outline text-sm text-center justify-center">View Today's Content</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <section className="islamic-bg-dark py-14 px-4 text-center">
        <span className="section-label text-gold-300">{currentYear} Service Year</span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-3 mb-3">
          Register with MCAN
        </h1>
        <p className="text-green-200 font-body max-w-xl mx-auto text-sm">
          Registration is open exclusively to corps members serving in Oyo State in the {currentYear} batch.
        </p>
      </section>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">

        {/* Notice */}
        <div className="flex gap-3 bg-gold-50 border border-gold-200 rounded-xl p-4 mb-8">
          <Info size={18} className="text-gold-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gold-800 font-body">
            <strong>Note:</strong> Only corps members in the <strong>{currentYear}</strong> service year can register.
            After registration, you'll receive programme updates and event notifications via email.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-6">
          <div className="pb-2 border-b border-gray-100">
            <h2 className="font-display text-xl font-semibold text-primary-800 flex items-center gap-2">
              <UserPlus size={20} className="text-gold-500" />
              Personal Information
            </h2>
          </div>

          {/* Full name */}
          <div>
            <label className="form-label">Full Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. Abdullahi Yusuf"
              required
            />
          </div>

          {/* State Code */}
          <div>
            <label className="form-label">State Code <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="state_code"
              value={form.state_code}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. OY/24/1234"
              required
            />
            <p className="text-xs text-gray-400 mt-1 font-body">Your NYSC state code as shown on your call-up letter</p>
          </div>

          {/* Phone + Email */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Phone Number <span className="text-red-500">*</span></label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="form-input"
                placeholder="08012345678"
                required
              />
            </div>
            <div>
              <label className="form-label">Email Address <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="form-input"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Gender + State of Origin */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Gender <span className="text-red-500">*</span></label>
              <select name="gender" value={form.gender} onChange={handleChange} className="form-input" required>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="form-label">State of Origin <span className="text-red-500">*</span></label>
              <select name="state_of_origin" value={form.state_of_origin} onChange={handleChange} className="form-input" required>
                <option value="">Select state</option>
                {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Batch + Stream */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Batch <span className="text-red-500">*</span></label>
              <select name="batch" value={form.batch} onChange={handleChange} className="form-input" required>
                <option value="">Select batch</option>
                <option value="A">Batch A</option>
                <option value="B">Batch B</option>
                <option value="C">Batch C</option>
              </select>
            </div>
            <div>
              <label className="form-label">Stream <span className="text-red-500">*</span></label>
              <select name="stream" value={form.stream} onChange={handleChange} className="form-input" required>
                <option value="">Select stream</option>
                <option value="1">Stream 1</option>
                <option value="2">Stream 2</option>
              </select>
            </div>
          </div>

          {/* Posting details */}
          <div className="pt-2 border-t border-gray-100">
            <h3 className="font-display text-lg font-semibold text-gray-700 mb-4">Posting Details (Optional)</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Primary Place of Assignment (PPA)</label>
                <input
                  type="text"
                  name="ppa"
                  value={form.ppa}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. St. Mary's Secondary School"
                />
              </div>
              <div>
                <label className="form-label">LGA of Posting</label>
                <input
                  type="text"
                  name="lga_of_posting"
                  value={form.lga_of_posting}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Ibadan North"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
            {loading ? 'Registering...' : 'Complete Registration'}
          </button>

          <p className="text-xs text-gray-400 text-center font-body">
            By registering, you agree to receive programme updates from MCAN Oyo State via email.
          </p>
        </form>
      </div>
    </div>
  )
}
