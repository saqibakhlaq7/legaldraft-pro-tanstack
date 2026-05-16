import { useState, useEffect } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { Menu, X, Scale } from 'lucide-react'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'About', path: '/about' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-navy-900/95 backdrop-blur-xl border-b border-gold-500/15'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <Scale className="w-6 h-6 text-gold-500 transition-transform duration-300 group-hover:scale-110" />
          <span className="font-display font-bold text-xl text-gold-500 tracking-tight">
            LegalDraft Pro
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path as any}
              className={`font-body font-medium text-sm uppercase tracking-[0.08em] transition-colors duration-200 text-slate-300 hover:text-gold-500`}
              activeProps={{
                className: 'text-gold-500',
              }}
            >
              {link.label}
              {pathname === link.path && (
                <span className="block h-px w-full bg-gold-500 mt-0.5" />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Link
            to="/request"
            className="inline-flex items-center justify-center rounded bg-gold-500 text-navy-900 font-body font-medium text-xs uppercase tracking-wider px-5 py-2.5 transition-all duration-250 hover:bg-gold-400 hover:-translate-y-px hover:shadow-gold"
          >
            Get Document
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden text-slate-300 hover:text-gold-500 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 top-[72px] bg-navy-900/98 backdrop-blur-xl transition-all duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col items-center gap-8 pt-12">
          {navLinks.map((link, i) => (
            <Link
              key={link.path}
              to={link.path as any}
              className={`font-body font-medium text-lg uppercase tracking-[0.08em] transition-all duration-300 text-slate-300 hover:text-gold-500`}
              activeProps={{
                className: 'text-gold-500',
              }}
              style={{
                transitionDelay: isOpen ? `${i * 50}ms` : '0ms',
                transform: isOpen ? 'translateY(0)' : 'translateY(10px)',
                opacity: isOpen ? 1 : 0,
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/request"
            className="mt-4 inline-flex items-center justify-center rounded bg-gold-500 text-navy-900 font-body font-medium text-sm uppercase tracking-wider px-8 py-3 transition-all duration-250 hover:bg-gold-400"
          >
            Get Your Document
          </Link>
        </div>
      </div>
    </nav>
  )
}
