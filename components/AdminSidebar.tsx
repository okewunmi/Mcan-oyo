'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, CalendarDays, BookOpen, Users, Hammer,
  MapPin, Building2, UserCheck, Mail, Settings,
  LogOut, Menu, X, ChevronRight,Newspaper, CreditCard
} from 'lucide-react'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

const navItems = [
  { href: '/admin',                  label: 'Dashboard',      icon: LayoutDashboard },
  { href: '/admin/events',           label: 'Events',         icon: CalendarDays },
  { href: '/admin/projects',         label: 'Projects',       icon: Hammer },
  { href: '/admin/daily-content',    label: 'Daily Content',  icon: BookOpen },
  { href: '/admin/executives',       label: 'Executives',     icon: Users },
  { href: '/admin/bank-accounts',    label: 'Bank Accounts', icon: CreditCard },
  { href: '/admin/news',             label: 'News',           icon: Newspaper },
  { href: '/admin/lgi',              label: 'LGI & MCLO',     icon: MapPin },
  { href: '/admin/lodges',           label: 'Lodges',         icon: Building2 },
  { href: '/admin/registrations',    label: 'Registrations',  icon: UserCheck },
  { href: '/admin/emails',           label: 'Email Campaigns',icon: Mail },
  { href: '/admin/settings',         label: 'Settings',       icon: Settings },
]

export default function AdminSidebar() {
  const pathname  = usePathname()
  const router    = useRouter()
  const [open, setOpen] = useState(false)
  const supabase  = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    toast.success('Logged out')
    router.push('/login')
    router.refresh()
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold font-display">MC</span>
          </div>
          <div>
            <p className="text-white font-semibold text-sm font-display leading-tight">MCAN Oyo</p>
            <p className="text-green-300 text-xs font-body">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`admin-nav-link ${active ? 'active' : ''}`}
            >
              <Icon size={17} className="flex-shrink-0" />
              <span>{label}</span>
              {active && <ChevronRight size={14} className="ml-auto opacity-60" />}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 border-t border-white/10 pt-4">
        <button
          onClick={handleLogout}
          className="admin-nav-link w-full text-left text-red-300 hover:text-red-200 hover:bg-red-500/15"
        >
          <LogOut size={17} />
          <span>Sign Out</span>
        </button>
        <Link
          href="/"
          className="admin-nav-link mt-1 text-green-300 hover:text-white"
        >
          <ChevronRight size={17} className="rotate-180" />
          <span>View Site</span>
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-56 xl:w-60 flex-shrink-0 flex-col islamic-bg-dark min-h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden islamic-bg-dark flex items-center justify-between px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white/15 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">MC</span>
          </div>
          <span className="text-white font-semibold text-sm font-display">Admin</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="text-white p-1"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-64 islamic-bg-dark flex flex-col">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  )
}
