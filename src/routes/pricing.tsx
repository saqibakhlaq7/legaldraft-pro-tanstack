import { createFileRoute } from '@tanstack/react-router'
import { Tag, Check, Zap, ShieldCheck } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/pricing')({
  component: Pricing,
})

const PRICING_PLANS = [
  {
    name: 'Standard',
    price: '₹299',
    description: 'Perfect for simple affidavits and personal documents.',
    features: [
      '24-Hour Delivery',
      'PDF & Word Formats',
      'Standard Legal Language',
      'Email Support',
      '1 Free Revision',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Professional',
    price: '₹699',
    description: 'Ideal for contracts, notices, and business documents.',
    features: [
      '18-Hour Delivery',
      'Custom Clauses included',
      'Advanced Legal Drafting',
      'Priority Support',
      '2 Free Revisions',
      'Property & Civil Matters',
    ],
    cta: 'Choose Professional',
    popular: true,
  },
  {
    name: 'Premium / Lawyer Signed',
    price: '₹1,499',
    description: 'For court submissions and high-stakes legal matters.',
    features: [
      'Delhi Court Lawyer Review',
      'Official Signature & Stamp',
      'Legal Authenticity Certificate',
      '12-Hour Delivery (Express)',
      'Direct Legal Consultation',
      'Unlimited Revisions',
    ],
    cta: 'Request Premium',
    popular: false,
  },
]

function Pricing() {
  return (
    <div className="min-h-[100dvh] bg-cream-50 pt-[72px]">
      <div className="bg-navy-900 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Tag className="w-12 h-12 text-gold-500 mx-auto mb-6" />
          <h1 className="font-display text-4xl lg:text-5xl text-white">Transparent Pricing</h1>
          <p className="mt-4 text-slate-400 max-w-lg mx-auto text-lg">
            No hidden fees. Professional legal drafting starting at competitive prices.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRICING_PLANS.map((plan) => (
            <div 
              key={plan.name} 
              className={`relative bg-white border ${plan.popular ? 'border-gold-500 shadow-gold/10 scale-105 z-10' : 'border-cream-200'} rounded-xl p-8 shadow-lg flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold-500 text-navy-900 text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="font-display text-2xl text-navy-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-navy-900">{plan.price}</span>
                  <span className="text-slate-500 text-sm">/ doc</span>
                </div>
                <p className="mt-4 text-slate-500 text-sm leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 ${plan.popular ? 'text-gold-500' : 'text-success'} shrink-0 mt-0.5`} />
                    <span className="text-slate-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                to="/request" 
                className={`w-full py-4 rounded-lg font-bold text-sm uppercase tracking-wider transition-all text-center ${
                  plan.popular 
                    ? 'bg-gold-500 text-navy-900 hover:bg-gold-400 shadow-gold' 
                    : 'bg-navy-900 text-white hover:bg-navy-800'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-gold-500" />
            </div>
            <div>
              <h4 className="font-display text-xl text-navy-900 mb-2">Express Processing</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Need it faster? Add express delivery to any standard document for just ₹299 and get your draft within 12 hours.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-gold-500" />
            </div>
            <div>
              <h4 className="font-display text-xl text-navy-900 mb-2">Legal Guarantee</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                All our documents are drafted by legal experts. If your document is rejected due to drafting errors, we offer a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
