import { createFileRoute } from '@tanstack/react-router'
import { HelpCircle, ChevronDown, Search } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/faq')({
  component: FAQ,
})

const FAQ_DATA = [
  {
    category: 'General',
    items: [
      {
        q: 'What is LegalDraft Pro?',
        a: 'LegalDraft Pro is a specialized platform that provides professionally drafted legal documents for the Indian market. We use a combination of legal expertise and technology to deliver court-ready documents like affidavits, agreements, and notices within 24 hours.',
      },
      {
        q: 'Is this a law firm?',
        a: 'We are a legal technology platform, not a traditional law firm. While we employ legal experts and partner with practicing advocates, our service is focused on providing high-quality legal documentation and drafting services based on your inputs.',
      },
    ],
  },
  {
    category: 'Process & Delivery',
    items: [
      {
        q: 'How long does it take to receive my document?',
        a: 'Our standard delivery time is 24 hours from the time of payment confirmation. If you choose our "Express Delivery" option, you will receive your document within 12 hours.',
      },
      {
        q: 'In what format will I receive the document?',
        a: 'You will receive your document in two formats: PDF (for final viewing and printing) and Microsoft Word (.docx) for any minor adjustments you might want to make.',
      },
      {
        q: 'Can I request revisions?',
        a: 'Yes, we offer one free revision within 7 days of delivery. If you need major changes or revisions after this period, a nominal fee may apply.',
      },
    ],
  },
  {
    category: 'Validity & Signature',
    items: [
      {
        q: 'Are these documents legally valid?',
        a: 'Yes, all our documents are drafted according to current Indian laws (like the Indian Contract Act, Transfer of Property Act, etc.) and follow the formatting standards required by Indian courts.',
      },
      {
        q: 'What is the "Lawyer Signed" service?',
        a: 'Some documents require an official stamp or the signature of a practicing advocate to be accepted by certain authorities or courts. When you opt for this service, our partnered Delhi Court lawyer reviews your document and provides their official signature and stamp.',
      },
      {
        q: 'Do I still need to notarize the document?',
        a: 'Yes, if the document (like an affidavit) requires notarization or needs to be on stamp paper, you will need to print our draft on the appropriate stamp paper and take it to a local notary. We provide guidance on the required stamp duty for your state.',
      },
    ],
  },
  {
    category: 'Payment & Security',
    items: [
      {
        q: 'Is my data secure?',
        a: 'Absolutely. We use industry-standard encryption to protect your personal information and document details. We never share your data with third parties except for the legal professionals involved in your drafting.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We use Razorpay, which supports all major Indian credit/debit cards, UPI (GPay, PhonePe, etc.), and net banking from all major Indian banks.',
      },
    ],
  },
]

function FAQ() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFaqs = FAQ_DATA.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0)

  return (
    <div className="min-h-[100dvh] bg-cream-50 pt-[72px]">
      <div className="bg-navy-900 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <HelpCircle className="w-12 h-12 text-gold-500 mx-auto mb-6" />
          <h1 className="font-display text-4xl lg:text-5xl text-white">Frequently Asked Questions</h1>
          <p className="mt-4 text-slate-400 max-w-lg mx-auto text-lg">
            Everything you need to know about our legal document services.
          </p>

          <div className="mt-10 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search for questions..."
              className="w-full bg-white/10 border border-white/20 rounded-full py-4 pl-12 pr-6 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-24">
        {filteredFaqs.length > 0 ? (
          <div className="space-y-16">
            {filteredFaqs.map((category) => (
              <div key={category.category}>
                <h3 className="font-display text-2xl text-navy-900 mb-8 flex items-center gap-3">
                  <span className="w-8 h-px bg-gold-500" />
                  {category.category}
                </h3>
                <div className="space-y-4">
                  {category.items.map((item, i) => (
                    <details 
                      key={i} 
                      className="group bg-white border border-cream-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                    >
                      <summary className="flex items-center justify-between cursor-pointer p-6 list-none">
                        <span className="font-body font-semibold text-navy-900 pr-4">
                          {item.q}
                        </span>
                        <ChevronDown className="w-5 h-5 text-gold-500 shrink-0 transition-transform duration-300 group-open:rotate-180" />
                      </summary>
                      <div className="px-6 pb-6 pt-0">
                        <div className="h-px bg-cream-100 mb-6" />
                        <p className="text-slate-600 leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">No results found for &ldquo;{searchQuery}&rdquo;</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 text-gold-600 font-medium hover:underline"
            >
              Clear search
            </button>
          </div>
        )}

        <div className="mt-24 bg-cream-100 border border-cream-200 rounded-2xl p-10 text-center">
          <h3 className="font-display text-2xl text-navy-900 mb-4">Still have questions?</h3>
          <p className="text-slate-600 mb-8">
            Our support team is available Monday through Saturday to help you with any queries.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="mailto:support@legaldraft.pro" className="btn-primary px-8">
              Email Support
            </a>
            <a href="tel:+919876543210" className="btn-secondary px-8">
              Call +91 98765 43210
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
