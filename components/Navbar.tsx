'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown } from 'lucide-react'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/',            label: 'Home' },
  { href: '/about',       label: 'About' },
  { href: '/news',        label: 'News' },
  { href: '/daily',       label: 'Daily Content' },
  { href: '/projects',    label: 'Projects' },
  { href: '/lgi',         label: 'LGI / MCLO' },
  { href: '/lodges',      label: 'Lodges' },
 // { href: '/executives',  label: 'Executives' },
  { href: '/register',    label: 'Register' },
  { href: '/donate',      label: 'Donate', highlight: true },
]

export default function Navbar() {
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // Don't render public navbar on admin routes
  if (pathname.startsWith('/admin')) return null

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
<Link href="/" className="flex items-center gap-3 flex-shrink-0">
  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-100 bg-primary-700 flex items-center justify-center">
    <img
      src="/images/logo.jpg"
      alt="MCAN Oyo State Logo"
      className="w-full h-full object-cover"
    />
  </div>
  <div className="hidden sm:block">
    <p className="font-display text-primary-700 font-semibold text-base leading-tight">MCAN Oyo State</p>
    <p className="text-xs text-gold-600 font-body" style={{ fontSize: '0.65rem', letterSpacing: '0.08em' }}>
      Serving Islam Through the Nation
    </p>
  </div>
</Link>
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.highlight ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="btn-gold text-sm px-4 py-2 ml-2"
                  style={{ padding: '0.45rem 1.1rem', fontSize: '0.875rem' }}
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 font-body ${
                    pathname === link.href
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-700 hover:bg-primary-50'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-primary-700 hover:bg-primary-50 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="lg:hidden border-t border-gray-100 py-3 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-colors font-body ${
                    link.highlight
                      ? 'bg-gold-500 text-white font-semibold'
                      : pathname === link.href
                      ? 'text-primary-700 bg-primary-50 font-semibold'
                      : 'text-gray-700 hover:text-primary-700 hover:bg-primary-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
