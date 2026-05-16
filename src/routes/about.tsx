import { createFileRoute } from '@tanstack/react-router'
import { Building2, Users, Scale, Award } from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: About,
})

const VALUES = [
  {
    icon: Scale,
    title: 'Legal Integrity',
    description: 'We believe in precision. Every document is drafted with strict adherence to Indian laws and legal standards.',
  },
  {
    icon: Users,
    title: 'Client First',
    description: 'Legal jargon can be overwhelming. We make legal documentation accessible, understandable, and stress-free.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'From formatting to clause structure, we strive for excellence that meets court-ready standards.',
  },
]

function About() {
  return (
    <div className="min-h-[100dvh] bg-cream-50 pt-[72px]">
      <div className="bg-navy-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/legal-pattern.png')] bg-repeat opacity-20" />
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <Building2 className="w-16 h-16 text-gold-500 mx-auto mb-8" />
          <h1 className="font-display text-4xl lg:text-6xl text-white mb-6">Expertise. Integrity. <br />Accessibility.</h1>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto text-xl leading-relaxed">
            LegalDraft Pro is India&apos;s leading platform for professional legal documentation, bridging the gap between complex legal requirements and efficient digital delivery.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-3xl text-navy-900 mb-6">Our Mission</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Founded by a team of legal professionals and technology experts, LegalDraft Pro was born out of a simple observation: getting a simple affidavit or a standard contract shouldn&apos;t require multiple trips to a lawyer&apos;s office or waiting for days.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed">
              We leverage technology to streamline the drafting process while maintaining the human touch of legal expertise. Every document produced on our platform is reviewed by specialists to ensure it meets the highest standards of legal validity.
            </p>
          </div>
          <div className="relative">
            <img 
              src="/about-team.jpg" 
              alt="Our Team" 
              className="rounded-2xl shadow-2xl relative z-10"
            />
            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-gold-500 rounded-2xl z-0" />
          </div>
        </div>

        <div className="mt-32">
          <h2 className="font-display text-3xl text-navy-900 text-center mb-16">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {VALUES.map((value) => {
              const Icon = value.icon
              return (
                <div key={value.title} className="text-center group">
                  <div className="w-20 h-20 rounded-full bg-white border border-cream-200 flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:border-gold-500 group-hover:shadow-gold/10 transition-all duration-300">
                    <Icon className="w-10 h-10 text-gold-500" />
                  </div>
                  <h4 className="font-display text-xl text-navy-900 mb-4">{value.title}</h4>
                  <p className="text-slate-500 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-32 bg-navy-900 rounded-3xl p-12 lg:p-20 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full -mr-32 -mt-32" />
          <h2 className="font-display text-3xl lg:text-4xl mb-6 relative z-10">Trusted by Professionals</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg relative z-10">
            From individual entrepreneurs to large corporations, thousands of clients trust LegalDraft Pro for their legal paperwork needs across India.
          </p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Logo placeholders */}
            <span className="font-display text-2xl">CORPORATE CO</span>
            <span className="font-display text-2xl">LEGAL TECH</span>
            <span className="font-display text-2xl">VENTURE HUB</span>
            <span className="font-display text-2xl">PROP GURU</span>
          </div>
        </div>
      </div>
    </div>
  )
}
