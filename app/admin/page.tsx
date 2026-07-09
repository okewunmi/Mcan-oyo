import { createServerSupabaseClient } from '@/lib/supabase-server'
import { CalendarDays, Users, BookOpen, UserCheck, Mail } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const supabase = createServerSupabaseClient()
  const [events, executives, daily, regs] = await Promise.all([
    supabase.from('events').select('id', { count: 'exact', head: true }),
    supabase.from('executives').select('id', { count: 'exact', head: true }),
    supabase.from('daily_content').select('id', { count: 'exact', head: true }),
    supabase.from('registrations').select('id', { count: 'exact', head: true }).eq('service_year', new Date().getFullYear()),
  ])
  return {
    events:     events.count || 0,
    executives: executives.count || 0,
    daily:      daily.count || 0,
    regs:       regs.count || 0,
  }
}

export default async function AdminDashboard() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  console.log('ADMIN PAGE USER:', user?.email)   // ← add this line
  const stats = await getStats()

  const cards = [
    { label: 'Events',          value: stats.events,     icon: CalendarDays, href: '/admin/events',        color: 'bg-blue-50 text-blue-700' },
    { label: 'Executives',      value: stats.executives, icon: Users,         href: '/admin/executives',    color: 'bg-purple-50 text-purple-700' },
    { label: 'Daily Posts',     value: stats.daily,      icon: BookOpen,      href: '/admin/daily-content', color: 'bg-emerald-50 text-emerald-700' },
    { label: `${new Date().getFullYear()} Registrations`, value: stats.regs, icon: UserCheck, href: '/admin/registrations', color: 'bg-amber-50 text-amber-700' },
  ]

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 font-body text-sm mt-1">MCAN Oyo State — Admin Panel</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href} className="card p-5 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              <Icon size={20} />
            </div>
            <p className="font-display text-3xl font-bold text-gray-800">{value}</p>
            <p className="text-xs text-gray-500 font-body mt-1">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="font-display text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { href: '/admin/events/new',        label: 'Post New Event',       icon: CalendarDays, color: 'text-blue-600' },
          { href: '/admin/daily-content/new', label: 'Add Daily Content',    icon: BookOpen,     color: 'text-emerald-600' },
          { href: '/admin/emails',            label: 'Send Email Campaign',  icon: Mail,         color: 'text-red-600' },
          { href: '/admin/executives',        label: 'Update Executives',    icon: Users,        color: 'text-purple-600' },
          { href: '/admin/lgi',               label: 'Edit LGI Contacts',    icon: UserCheck,    color: 'text-amber-600' },
          { href: '/admin/registrations',     label: 'View Registrations',   icon: UserCheck,    color: 'text-teal-600' },
        ].map(({ href, label, icon: Icon, color }) => (
          <Link key={href} href={href}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-all group">
            <Icon size={18} className={`${color} flex-shrink-0`} />
            <span className="text-sm font-medium text-gray-700 group-hover:text-primary-800 font-body">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
