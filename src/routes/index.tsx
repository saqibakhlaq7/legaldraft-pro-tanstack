import { useRef } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Zap,
  ShieldCheck,
  Tag,
  FileText,
  FileSignature,
  ScrollText,
  Building2,
  Gavel,
  Briefcase,
  CheckCircle2,
  Quote,
  ChevronDown,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export const Route = createFileRoute('/')({
  component: Home,
})

/* ──────────── Hero Section ──────────── */
function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const overlineRef = useRef<HTMLParagraphElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const trustRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // Background fade in
      tl.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        0
      )

      // Overline
      tl.fromTo(
        overlineRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
        0.3
      )

      // Headline words stagger
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.hero-word')
        tl.fromTo(
          words,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
          },
          0.5
        )
      }

      // Subheadline
      tl.fromTo(
        subRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6 },
        1.1
      )

      // CTA buttons
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' },
        1.4
      )

      // Trust bar
      if (trustRef.current) {
        const items = trustRef.current.querySelectorAll('.trust-item')
        tl.fromTo(
          items,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, stagger: 0.1 },
          1.6
        )
      }
    },
    { scope: containerRef }
  )

  const headlineWords = 'Legally Sound Documents, Delivered in 24 Hours'.split(' ')

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #070B1A 0%, #0F1630 40%, #1B2747 100%)',
      }}
    >
      {/* Texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-soft-light pointer-events-none"
        style={{
          backgroundImage: 'url(/hero-bg-texture.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Gold glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '800px',
          height: '600px',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          background:
            'radial-gradient(ellipse at center, rgba(201,168,76,0.15) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center pt-[72px]">
        <p
          ref={overlineRef}
          className="font-body font-semibold text-xs uppercase tracking-[0.12em] text-gold-500 opacity-0"
        >
          Professional Legal Documents for India
        </p>

        <h1
          ref={headlineRef}
          className="font-display font-bold text-white mt-6 mx-auto max-w-[900px] opacity-0"
          style={{
            fontSize: 'clamp(2rem, 6vw, 5.5rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
          }}
        >
          {headlineWords.map((word, i) => (
            <span key={i} className="hero-word inline-block mr-[0.3em] opacity-0">
              {word === 'Documents,' ? (
                <>
                  Documents,
                  <br className="hidden sm:block" />
                </>
              ) : (
                word
              )}
            </span>
          ))}
        </h1>

        <p
          ref={subRef}
          className="font-body text-lg text-slate-400 max-w-[640px] mx-auto mt-6 leading-relaxed opacity-0"
        >
          From affidavits to contracts, our team of legal experts prepares
          court-ready documents tailored to your needs. Trusted by
          professionals across India.
        </p>

        <div
          ref={ctaRef}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0"
        >
          <Link to="/request" className="btn-primary px-10 py-4 text-base">
            Get Your Document
          </Link>
          <Link to="/services" className="btn-secondary px-10 py-4 text-base">
            Explore Services
          </Link>
        </div>

        <div
          ref={trustRef}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-0"
        >
          <div className="trust-item flex items-center gap-2.5 opacity-0">
            <Zap className="w-4 h-4 text-gold-500" />
            <span className="font-body font-medium text-sm text-slate-300">
              24-Hour Delivery
            </span>
          </div>
          <div className="trust-item flex items-center gap-2.5 opacity-0">
            <ShieldCheck className="w-4 h-4 text-gold-500" />
            <span className="font-body font-medium text-sm text-slate-300">
              Legally Verified
            </span>
          </div>
          <div className="trust-item flex items-center gap-2.5 opacity-0">
            <Tag className="w-4 h-4 text-gold-500" />
            <span className="font-body font-medium text-sm text-slate-300">
              Transparent Pricing
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────── Stats Section ──────────── */
function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const counters = sectionRef.current?.querySelectorAll('.stat-number')
      if (!counters) return

      counters.forEach((counter) => {
        const target = parseFloat(counter.getAttribute('data-target') || '0')
        const suffix = counter.getAttribute('data-suffix') || ''
        const isDecimal = counter.getAttribute('data-decimal') === 'true'
        const obj = { val: 0 }

        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: counter,
            start: 'top 80%',
            once: true,
          },
          onUpdate: () => {
            if (isDecimal) {
              counter.textContent = obj.val.toFixed(0) + suffix
            } else {
              counter.textContent = Math.floor(obj.val).toLocaleString() + suffix
            }
          },
        })
      })

      // Labels fade up
      gsap.fromTo(
        sectionRef.current!.querySelectorAll('.stat-label'),
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
          delay: 1.5,
        }
      )
    },
    { scope: sectionRef }
  )

  const stats = [
    { value: 2500, suffix: '+', label: 'Documents Delivered' },
    { value: 48, suffix: '', label: 'Document Types' },
    { value: 24, suffix: 'h', label: 'Fastest Delivery', decimal: true },
    { value: 98, suffix: '%', label: 'Client Satisfaction', decimal: true },
  ]

  return (
    <section
      ref={sectionRef}
      className="bg-cream-50 border-y border-cream-200 py-16"
    >
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center ${
                i < stats.length - 1
                  ? 'lg:border-r lg:border-cream-200'
                  : ''
              }`}
            >
              <div
                className="stat-number font-display text-gold-500"
                style={{
                  fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                  lineHeight: 1.2,
                }}
                data-target={stat.value}
                data-suffix={stat.suffix}
                data-decimal={stat.decimal ? 'true' : 'false'}
              >
                0{stat.suffix}
              </div>
              <p className="stat-label mt-2 font-body font-medium text-sm uppercase tracking-[0.06em] text-slate-500 opacity-0">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────── Services Section ──────────── */
function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        sectionRef.current!.querySelector('.services-header'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      )

      gsap.fromTo(
        sectionRef.current!.querySelectorAll('.service-card'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current!.querySelector('.services-grid'),
            start: 'top 85%',
            once: true,
          },
        }
      )
    },
    { scope: sectionRef }
  )

  const services = [
    {
      icon: FileText,
      title: 'Legal Notices',
      desc: 'Draft precise legal notices for recovery, eviction, and civil matters with proper legal formatting.',
    },
    {
      icon: FileSignature,
      title: 'Contracts & Agreements',
      desc: 'Comprehensive commercial and personal agreements tailored to your specific transaction needs.',
    },
    {
      icon: ScrollText,
      title: 'Affidavits & Declarations',
      desc: 'Statutory declarations and sworn affidavits formatted for acceptance across Indian courts.',
    },
    {
      icon: Building2,
      title: 'Property Documents',
      desc: 'Sale deeds, rental agreements, and property-related documents with stamp duty guidance.',
    },
    {
      icon: Gavel,
      title: 'Court Petitions',
      desc: 'Professionally structured petitions and applications for civil and criminal proceedings.',
    },
    {
      icon: Briefcase,
      title: 'Corporate Documents',
      desc: 'MOUs, partnership deeds, and company formation documents for your business needs.',
    },
  ]

  return (
    <section ref={sectionRef} className="bg-white py-16 lg:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="services-header">
          <p className="font-body font-semibold text-xs uppercase tracking-[0.12em] text-gold-500">
            Our Services
          </p>
          <h2 className="font-display text-3xl lg:text-[2rem] text-slate-800 mt-4">
            Documents for Every Legal Need
          </h2>
          <p className="font-body text-base text-slate-500 max-w-[560px] mt-4 leading-relaxed">
            Whether it&apos;s a personal affidavit or a complex commercial agreement,
            we handle it with precision and legal expertise.
          </p>
        </div>

        <div className="services-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.title}
                className="service-card group bg-cream-50 border border-cream-200 rounded-lg p-8 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/30 hover:shadow-lg"
              >
                <div className="w-[72px] h-[72px] rounded-full bg-gold-500/8 flex items-center justify-center">
                  <Icon className="w-12 h-12 text-gold-500 transition-transform duration-300 group-hover:scale-[1.08]" />
                </div>
                <h4 className="font-body font-semibold text-xl text-slate-800 mt-5">
                  {service.title}
                </h4>
                <p className="font-body text-base text-slate-500 mt-2 leading-relaxed line-clamp-2">
                  {service.desc}
                </p>
                <Link
                  to="/services"
                  className="inline-block mt-4 font-body font-medium text-sm text-gold-500 hover:underline"
                >
                  Learn more &rarr;
                </Link>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link to="/services" className="btn-secondary">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ──────────── Process Section ──────────── */
function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        sectionRef.current!.querySelector('.process-header'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      )

      // Horizontal line fill animation
      const line = sectionRef.current!.querySelector('.process-line-fill')
      if (line) {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current!.querySelector('.process-steps'),
              start: 'top 80%',
              once: true,
            },
          }
        )
      }

      gsap.fromTo(
        sectionRef.current!.querySelectorAll('.process-step'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current!.querySelector('.process-steps'),
            start: 'top 80%',
            once: true,
          },
        }
      )
    },
    { scope: sectionRef }
  )

  const steps = [
    {
      num: '1',
      img: '/process-step-1.jpg',
      title: 'Submit Your Request',
      desc: 'Fill out our detailed form with your specific requirements. The more information you provide, the more precise your document will be.',
    },
    {
      num: '2',
      img: '/process-step-2.jpg',
      title: 'Secure Payment',
      desc: 'Complete your payment through our secure gateway. We accept UPI, cards, and net banking. Your transaction is fully encrypted.',
    },
    {
      num: '3',
      img: '/process-step-3.jpg',
      title: 'Receive Your Document',
      desc: 'Get your professionally drafted document delivered to your email within 24 hours. Review and request revisions if needed.',
    },
  ]

  return (
    <section ref={sectionRef} className="bg-navy-900 py-16 lg:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="process-header text-center">
          <p className="font-body font-semibold text-xs uppercase tracking-[0.12em] text-gold-500">
            Simple Process
          </p>
          <h2 className="font-display text-3xl lg:text-[2rem] text-white mt-4">
            Get Your Document in 3 Easy Steps
          </h2>
          <p className="font-body text-base text-slate-400 max-w-lg mx-auto mt-4 leading-relaxed">
            No complicated procedures. Just fill, pay, and receive.
          </p>
        </div>

        <div className="process-steps relative mt-16">
          {/* Desktop connecting line */}
          <div className="hidden lg:block absolute top-7 left-[16.67%] right-[16.67%] h-0.5 bg-navy-700">
            <div
              className="process-line-fill absolute inset-0 bg-gold-500 origin-left"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step) => (
              <div key={step.num} className="process-step text-center">
                {/* Step number circle */}
                <div className="relative z-10 mx-auto w-14 h-14 rounded-full border-2 border-gold-500 flex items-center justify-center bg-navy-900">
                  <span className="font-display font-bold text-xl text-gold-500">
                    {step.num}
                  </span>
                </div>

                {/* Image */}
                <div className="mt-6 overflow-hidden rounded-lg aspect-[4/3]">
                  <img
                    src={step.img}
                    alt={step.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Card */}
                <div className="mt-6 bg-navy-800 border border-navy-700 rounded-lg p-8">
                  <h3 className="font-display text-2xl text-white">{step.title}</h3>
                  <p className="font-body text-base text-slate-400 mt-3 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────── Featured Service Section ──────────── */
function FeaturedSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        sectionRef.current!.querySelector('.featured-left'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      )

      gsap.fromTo(
        sectionRef.current!.querySelector('.featured-right'),
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      )

      gsap.fromTo(
        sectionRef.current!.querySelectorAll('.bullet-item'),
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current!.querySelector('.bullet-list'),
            start: 'top 85%',
            once: true,
          },
        }
      )
    },
    { scope: sectionRef }
  )

  const bullets = [
    'Reviewed by a practicing Delhi Court lawyer',
    'Official signature and stamp included',
    'Ideal for court submissions',
    'Available for all document types',
  ]

  return (
    <section ref={sectionRef} className="bg-cream-50 py-16 lg:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Column */}
          <div className="featured-left w-full lg:w-[55%] opacity-0">
            <p className="font-body font-semibold text-xs uppercase tracking-[0.12em] text-gold-500">
              Premium Service
            </p>
            <h2 className="font-display text-3xl lg:text-[2rem] text-slate-800 mt-4">
              Lawyer-Signed Documents
            </h2>
            <p className="font-body text-lg text-slate-800 mt-6 leading-relaxed">
              For documents that require additional legal weight, our partnered civil
              lawyer from the Delhi High Court can review, verify, and sign your
              documents. This adds an extra layer of authenticity and legal standing,
              especially useful for court submissions, government applications, and
              high-stakes agreements.
            </p>

            <ul className="bullet-list mt-6 space-y-3">
              {bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="bullet-item flex items-center gap-3 opacity-0"
                >
                  <CheckCircle2 className="w-[18px] h-[18px] text-gold-500 shrink-0" />
                  <span className="font-body text-base text-slate-800">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>

            {/* Price callout */}
            <div className="mt-8 inline-block border border-gold-500 rounded-lg px-6 py-4">
              <p className="font-body font-semibold text-lg text-gold-500">
                Starting at ₹1,499 per document
              </p>
              <p className="font-body text-sm text-slate-500 mt-1">
                Standard document fees apply separately
              </p>
            </div>

            <div className="mt-6">
              <Link to="/request" className="btn-primary">
                Request Signed Document
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="featured-right w-full lg:w-[45%] relative opacity-0">
            <div className="relative overflow-hidden rounded-lg shadow-dark">
              <img
                src="/lawyer-portrait.jpg"
                alt="Advocate, Delhi High Court"
                className="w-full aspect-[3/4] object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute bottom-6 right-6 bg-gold-500/12 text-gold-500 px-4 py-2 rounded text-xs font-body font-medium uppercase tracking-[0.06em]">
              Advocate, Delhi High Court
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────── Testimonials Section ──────────── */
function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        sectionRef.current!.querySelectorAll('.testimonial-card'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current!.querySelector('.testimonials-grid'),
            start: 'top 85%',
            once: true,
          },
        }
      )
    },
    { scope: sectionRef }
  )

  const testimonials = [
    {
      quote:
        'The affidavit was perfectly drafted and delivered within 12 hours. Saved me multiple trips to the lawyer\'s office.',
      name: 'Rahul Sharma',
      role: 'Business Owner, Mumbai',
      image: '/testimonial-1.jpg',
    },
    {
      quote:
        'Professional service and excellent document quality. The rental agreement covered everything I needed for my property.',
      name: 'Priya Nair',
      role: 'Startup Founder, Bangalore',
      image: '/testimonial-2.jpg',
    },
    {
      quote:
        'I needed a court petition urgently and they delivered a well-structured document in under 24 hours. Highly recommended.',
      name: 'Vikram Patel',
      role: 'Property Consultant, Ahmedabad',
      image: '/testimonial-3.jpg',
    },
  ]

  return (
    <section ref={sectionRef} className="bg-white py-16 lg:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <p className="font-body font-semibold text-xs uppercase tracking-[0.12em] text-gold-500">
            Testimonials
          </p>
          <h2 className="font-display text-3xl lg:text-[2rem] text-slate-800 mt-4">
            Trusted by Thousands Across India
          </h2>
        </div>

        <div className="testimonials-grid grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="testimonial-card bg-cream-50 border border-cream-200 rounded-lg p-10 relative opacity-0"
            >
              <Quote className="w-6 h-6 text-gold-500/40 absolute top-8 left-8" />
              <p className="font-body text-lg text-slate-800 leading-relaxed italic mt-8">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="h-px bg-cream-200 my-6" />

              <div className="flex items-center gap-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="font-body font-semibold text-base text-slate-800">
                    {t.name}
                  </p>
                  <p className="font-body text-sm text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────── CTA Banner Section ──────────── */
function CTABannerSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        sectionRef.current!.querySelector('.cta-content'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      )
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      className="bg-navy-900 py-16 lg:py-24 relative overflow-hidden"
    >
      {/* Pulsing gold glow */}
      <div
        className="absolute inset-0 pointer-events-none animate-pulse-glow"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(201,168,76,0.12) 0%, transparent 60%)',
        }}
      />

      <div className="cta-content relative z-10 max-w-3xl mx-auto px-6 text-center opacity-0">
        <h2
          className="font-display font-bold text-white"
          style={{
            fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}
        >
          Ready to Get Your Legal Document?
        </h2>
        <p className="font-body text-lg text-slate-400 max-w-[600px] mx-auto mt-4 leading-relaxed">
          Join thousands who trust us with their legal paperwork. Your document
          will be in your inbox within 24 hours.
        </p>
        <div className="mt-8">
          <Link to="/request" className="btn-primary px-10 py-4 text-base">
            Start Your Request
          </Link>
        </div>
        <p className="mt-4 font-body text-sm text-slate-500">
          Questions? Reach out at{' '}
          <a
            href="mailto:support@legaldraft.pro"
            className="text-gold-500 hover:underline"
          >
            support@legaldraft.pro
          </a>
        </p>
      </div>
    </section>
  )
}

/* ──────────── FAQ Preview Section ──────────── */
function FAQPreviewSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        sectionRef.current!.querySelectorAll('.faq-item'),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      )
    },
    { scope: sectionRef }
  )

  const faqs = [
    {
      q: 'What types of documents can you prepare?',
      a: 'We prepare a wide range of legal documents including affidavits, rental agreements, sale deeds, legal notices, partnership deeds, MOUs, court petitions, and more. Visit our Services page for the complete list.',
    },
    {
      q: 'How soon will I receive my document?',
      a: 'All standard documents are delivered within 24 hours of payment confirmation. Lawyer-signed documents may take up to 48 hours due to the review process.',
    },
    {
      q: 'Are these documents legally valid in Indian courts?',
      a: 'Yes, all our documents are drafted in accordance with current Indian law and legal standards. For enhanced validity, opt for our lawyer-signed service.',
    },
    {
      q: 'What if I need changes to my document?',
      a: 'We offer one free revision within 7 days of delivery. Additional revisions are available at a nominal charge.',
    },
  ]

  return (
    <section ref={sectionRef} className="bg-cream-50 py-16 lg:py-32">
      <div className="max-w-[800px] mx-auto px-6">
        <div className="text-center">
          <p className="font-body font-semibold text-xs uppercase tracking-[0.12em] text-gold-500">
            FAQ
          </p>
          <h2 className="font-display text-3xl lg:text-[2rem] text-slate-800 mt-4">
            Common Questions
          </h2>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="faq-item group bg-white border border-cream-200 rounded-lg overflow-hidden opacity-0"
            >
              <summary className="flex items-center justify-between cursor-pointer p-5 lg:px-6 list-none">
                <span className="font-body font-semibold text-base text-slate-800 pr-4">
                  {faq.q}
                </span>
                <ChevronDown className="w-5 h-5 text-slate-500 shrink-0 transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <div className="px-5 lg:px-6 pb-5">
                <p className="font-body text-base text-slate-500 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </details>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/faq" className="btn-secondary">
            View All FAQs
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ──────────── Home Page ──────────── */
function Home() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <ProcessSection />
      <FeaturedSection />
      <TestimonialsSection />
      <CTABannerSection />
      <FAQPreviewSection />
    </div>
  )
}
