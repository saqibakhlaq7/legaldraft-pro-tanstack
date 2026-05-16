import { createFileRoute } from '@tanstack/react-router'
import { ListOrdered, PencilLine, CreditCard, MailCheck, ShieldCheck } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/how-it-works')({
  component: HowItWorks,
})

const STEPS = [
  {
    icon: PencilLine,
    title: '1. Fill the Request Form',
    description: 'Select your document type and provide the necessary details. Our intelligent form guides you through the information required for a legally sound document.',
  },
  {
    icon: CreditCard,
    title: '2. Secure Online Payment',
    description: 'Pay securely using Razorpay. We accept all major cards, UPI, and net banking. Your work begins immediately after payment confirmation.',
  },
  {
    icon: ShieldCheck,
    title: '3. Legal Drafting & Review',
    description: 'Our team of legal experts (and optionally a Delhi Court Lawyer) drafts your document based on your specific requirements and current Indian laws.',
  },
  {
    icon: MailCheck,
    title: '4. Delivery to Your Inbox',
    description: 'Receive your professionally drafted document in both PDF and Word formats within 24 hours (or 12 hours for express requests).',
  },
]

function HowItWorks() {
  return (
    <div className="min-h-[100dvh] bg-cream-50 pt-[72px]">
      <div className="bg-navy-900 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <ListOrdered className="w-12 h-12 text-gold-500 mx-auto mb-6" />
          <h1 className="font-display text-4xl lg:text-5xl text-white">How It Works</h1>
          <p className="mt-4 text-slate-400 max-w-lg mx-auto text-lg">
            A simple, streamlined process to get court-ready legal documents from the comfort of your home.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-24">
        <div className="space-y-20">
          {STEPS.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.title} className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div className="w-full md:w-1/2">
                  <div className="bg-white border border-cream-200 rounded-2xl p-8 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                    <Icon className="w-16 h-16 text-gold-500 mb-6" />
                    <h3 className="font-display text-2xl text-navy-900 mb-4">{step.title}</h3>
                    <p className="text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
                <div className="hidden md:block w-px h-24 bg-cream-200 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gold-500 shadow-gold" />
                </div>
                <div className="w-full md:w-1/2 text-center md:text-left">
                  <img 
                    src={`/how-it-works-${index + 1}.jpg`} 
                    alt={step.title}
                    className="rounded-lg shadow-lg w-full max-w-md mx-auto"
                  />
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-24 text-center">
          <h2 className="font-display text-3xl text-navy-900 mb-6">Ready to start?</h2>
          <Link to="/request" className="btn-primary px-12 py-4">
            Request Your Document Now
          </Link>
        </div>
      </div>
    </div>
  )
}
