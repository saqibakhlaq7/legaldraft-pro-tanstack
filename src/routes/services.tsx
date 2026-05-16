import { createFileRoute } from '@tanstack/react-router'
import { FileText, ChevronRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/services')({
  component: Services,
})

const DOCUMENT_CATEGORIES = {
  Affidavits: [
    'General Affidavit',
    'Name Change Affidavit',
    'Address Proof Affidavit',
    'Date of Birth Affidavit',
    'Income Affidavit',
  ],
  Agreements: [
    'Rental Agreement',
    'Leave & License Agreement',
    'Partnership Deed',
    'Service Agreement',
    'Non-Disclosure Agreement',
    'Employment Contract',
  ],
  Property: [
    'Sale Deed Draft',
    'Gift Deed',
    'Power of Attorney',
    'Will / Testament',
    'Relinquishment Deed',
  ],
  Notices: [
    'Legal Notice',
    ' eviction Notice',
    'Cheque Bounce Notice (Section 138)',
    'Consumer Complaint Notice',
  ],
  Court: [
    'Civil Suit Draft',
    'Writ Petition',
    'Bail Application',
    'Caveat Petition',
  ],
  Corporate: [
    'Company Registration Drafts',
    'MOA / AOA',
    'Board Resolution',
    'Shareholders Agreement',
  ],
}

function Services() {
  return (
    <div className="min-h-[100dvh] bg-cream-50 pt-[72px]">
      <div className="bg-navy-900 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <FileText className="w-12 h-12 text-gold-500 mx-auto mb-6" />
          <h1 className="font-display text-4xl lg:text-5xl text-white">Our Services</h1>
          <p className="mt-4 text-slate-400 max-w-lg mx-auto text-lg">
            Comprehensive legal document services for every need, delivered with precision and expertise.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(DOCUMENT_CATEGORIES).map(([category, docs]) => (
            <div key={category} className="bg-white border border-cream-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-display text-2xl text-navy-900 mb-6 border-b border-cream-100 pb-4">{category}</h3>
              <ul className="space-y-3">
                {docs.map((doc) => (
                  <li key={doc} className="flex items-center justify-between group">
                    <span className="text-slate-600 group-hover:text-gold-600 transition-colors">{doc}</span>
                    <Link 
                      to="/request" 
                      search={{ documentType: doc } as any}
                      className="text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-cream-100">
                <Link 
                  to="/request" 
                  className="text-navy-900 font-semibold text-sm uppercase tracking-wider hover:text-gold-600 transition-colors inline-flex items-center gap-2"
                >
                  Request {category} <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
