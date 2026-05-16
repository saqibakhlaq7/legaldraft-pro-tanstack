import { Link } from '@tanstack/react-router'
import { Scale, Mail, Phone, MapPin } from 'lucide-react'

const serviceLinks = [
  { label: 'Legal Notices', path: '/services' },
  { label: 'Contracts & Agreements', path: '/services' },
  { label: 'Affidavits & Declarations', path: '/services' },
  { label: 'Property Documents', path: '/services' },
  { label: 'Court Petitions', path: '/services' },
  { label: 'Corporate Documents', path: '/services' },
]

const companyLinks = [
  { label: 'About Us', path: '/about' },
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Contact', path: '/contact' },
]

export default function Footer() {
  return (
    <footer className="bg-navy-900 border-t border-navy-700">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 group">
              <Scale className="w-5 h-5 text-gold-500 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-display font-bold text-lg text-gold-500">
                LegalDraft Pro
              </span>
            </Link>
            <p className="mt-4 text-sm text-slate-500 leading-relaxed max-w-xs">
              Professional legal documents for India. Expert-crafted, court-ready, delivered within 24 hours.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a href="mailto:support@legaldraft.pro" className="text-slate-500 hover:text-gold-500 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="tel:+911234567890" className="text-slate-500 hover:text-gold-500 transition-colors">
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="font-body font-semibold text-sm text-slate-300 uppercase tracking-[0.08em] mb-5">
              Services
            </h4>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path as any}
                    className="text-sm text-slate-500 hover:text-gold-500 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-body font-semibold text-sm text-slate-300 uppercase tracking-[0.08em] mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path as any}
                    className="text-sm text-slate-500 hover:text-gold-500 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-body font-semibold text-sm text-slate-300 uppercase tracking-[0.08em] mb-5">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                <a
                  href="mailto:support@legaldraft.pro"
                  className="text-sm text-slate-500 hover:text-gold-500 transition-colors"
                >
                  support@legaldraft.pro
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                <a
                  href="tel:+911234567890"
                  className="text-sm text-slate-500 hover:text-gold-500 transition-colors"
                >
                  +91 12345 67890
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-500">
                  Delhi NCR, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-navy-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} LegalDraft Pro. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-xs text-slate-500 hover:text-gold-500 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/"
              className="text-xs text-slate-500 hover:text-gold-500 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
