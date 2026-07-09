

'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Search, Download, UserCheck, Mail, Phone } from 'lucide-react'
import { format } from 'date-fns'
import type { Registration } from '@/lib/supabase'

const currentYear = new Date().getFullYear()

export default function AdminRegistrationsPage() {
  const supabase = createClient()
  const [items, setItems]             = useState<Registration[]>([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [filterBatch, setFilterBatch]   = useState('all')
  const [filterGender, setFilterGender] = useState('all')
  const [filterStream, setFilterStream] = useState('all')
  const [filterYear, setFilterYear]   = useState(String(currentYear))

  const years = [String(currentYear), String(currentYear - 1), String(currentYear - 2)]

  async function fetchItems() {
    setLoading(true)
    let query = supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false })

    if (filterYear) query = query.eq('service_year', +filterYear)
    if (filterBatch  !== 'all') query = query.eq('batch', filterBatch)
    if (filterGender !== 'all') query = query.eq('gender', filterGender)
    if (filterStream !== 'all') query = query.eq('stream', filterStream)

    const { data, error } = await query
    if (error) console.error(error)
    setItems((data as Registration[]) || [])
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [filterBatch, filterGender, filterStream, filterYear])

  const filtered = items.filter(r =>
    !search ||
    r.full_name.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase()) ||
    r.state_code.toLowerCase().includes(search.toLowerCase()) ||
    (r.lga_of_posting || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.ppa || '').toLowerCase().includes(search.toLowerCase())
  )

  function exportCSV() {
    const headers = [
      'Full Name', 'State Code', 'State of Origin', 'Phone', 'Email',
      'Gender', 'Batch', 'Stream', 'PPA', 'LGA of Posting',
      'Service Year', 'Registered',
    ]
    const rows = filtered.map(r => [
      r.full_name,
      r.state_code,
      r.state_of_origin,
      r.phone,
      r.email,
      r.gender,
      r.batch,
      r.stream,
      r.ppa || '',
      r.lga_of_posting || '',
      r.service_year,
      format(new Date(r.created_at), 'yyyy-MM-dd HH:mm'),
    ])

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `mcan-oyo-${filterYear}-batch${filterBatch === 'all' ? 'all' : filterBatch}-registrations.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Stats
  const totalMale   = filtered.filter(r => r.gender === 'male').length
  const totalFemale = filtered.filter(r => r.gender === 'female').length

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800">Registrations</h1>
          <p className="text-sm text-gray-500 font-body">
            {filtered.length} corps member{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <button
          onClick={exportCSV}
          disabled={filtered.length === 0}
          className="btn-outline text-sm gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={16} /> Export CSV ({filtered.length})
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total',    value: filtered.length,  color: 'text-primary-700' },
          { label: 'Male',     value: totalMale,         color: 'text-blue-700' },
          { label: 'Female',   value: totalFemale,       color: 'text-pink-700' },
          { label: 'Batch A',  value: filtered.filter(r => r.batch === 'A').length, color: 'text-amber-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-4 text-center">
            <p className={`font-display text-3xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 font-body mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3  top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="form-input pl-9 text-sm py-2  pl-4"
            placeholder="Search name, email, state code, PPA, LGA..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-input text-sm py-2 w-auto"
          value={filterYear}
          onChange={e => setFilterYear(e.target.value)}
        >
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        <select
          className="form-input text-sm py-2 w-auto"
          value={filterBatch}
          onChange={e => setFilterBatch(e.target.value)}
        >
          <option value="all">All Batches</option>
          <option value="A">Batch A</option>
          <option value="B">Batch B</option>
          <option value="C">Batch C</option>
        </select>

        <select
          className="form-input text-sm py-2 w-auto"
          value={filterStream}
          onChange={e => setFilterStream(e.target.value)}
        >
          <option value="all">All Streams</option>
          <option value="1">Stream 1</option>
          <option value="2">Stream 2</option>
        </select>

        <select
          className="form-input text-sm py-2 w-auto"
          value={filterGender}
          onChange={e => setFilterGender(e.target.value)}
        >
          <option value="all">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-sm text-gray-400 font-body py-10 text-center">Loading registrations...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 card p-10">
          <UserCheck size={40} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-body text-sm">No registrations found.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {[
                    'Name', 'State Code', 'Phone', 'Email',
                    'Gender', 'Batch', 'LGA / PPA', 'Registered',
                  ].map(h => (
                    <th
                      key={h}
                      className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-800 whitespace-nowrap">{r.full_name}</p>
                      <p className="text-xs text-gray-400">{r.state_of_origin}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-mono text-xs whitespace-nowrap">
                      {r.state_code}
                    </td>
                    <td className="py-3 px-4">
                      
                        <a href={`tel:${r.phone}`}
                        className="flex items-center gap-1 text-primary-600 hover:text-primary-800 whitespace-nowrap"
                      >
                        <Phone size={11} /> {r.phone}
                      </a>
                    </td>
                    <td className="py-3 px-4">
                      
                        <a href={`mailto:${r.email}`}
                        className="flex items-center gap-1 text-primary-600 hover:text-primary-800 text-xs"
                      >
                        <Mail size={11} />
                        <span className="max-w-[160px] truncate inline-block">{r.email}</span>
                      </a>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge-${r.gender === 'male' ? 'primary' : 'gold'} capitalize`}>
                        {r.gender}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-primary-700">{r.batch}</span>
                      <span className="text-gray-400 ml-1 text-xs">/ S{r.stream}</span>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <p className="text-gray-600">{r.lga_of_posting || '—'}</p>
                      {r.ppa && (
                        <p className="text-gray-400 max-w-[140px] truncate">{r.ppa}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs whitespace-nowrap">
                      {format(new Date(r.created_at), 'MMM d, yy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-body">
            <span>Showing {filtered.length} of {items.length} registrations</span>
            <button onClick={exportCSV} className="flex items-center gap-1 text-primary-600 hover:text-primary-800 font-medium">
              <Download size={12} /> Download CSV
            </button>
          </div>
        </div>
      )}
    </div>
  )
}